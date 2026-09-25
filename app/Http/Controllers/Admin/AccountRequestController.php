<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountRequest;
use App\Models\Petugas;
use App\Models\Pimpinan;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AccountRequestController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('users.view'); // or separate permission if you prefer

        $query = AccountRequest::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('request_code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        if (in_array($sortField, ['request_code', 'nama_lengkap', 'email', 'status', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->input('perPage', 10);
        $requests = $query->paginate($perPage)->withQueryString();

        $summary = [
            'pending' => AccountRequest::where('status', 'pending')->count(),
            'reviewing' => AccountRequest::where('status', 'reviewing')->count(),
            'approved' => AccountRequest::where('status', 'approved')->count(),
            'rejected' => AccountRequest::where('status', 'rejected')->count(),
        ];

        return inertia('admin/AccountRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'perPage', 'sortField', 'sortDirection']),
            'summary' => $summary
        ]);
    }

    public function show(AccountRequest $accountRequest)
    {
        Gate::authorize('users.view');
        
        if ($accountRequest->status === 'pending') {
            $accountRequest->status = 'reviewing';
            $accountRequest->save();
        }

        return response()->json($accountRequest);
    }

    public function approve(Request $request, AccountRequest $accountRequest)
    {
        Gate::authorize('users.update');

        if (!in_array($accountRequest->status, ['pending', 'reviewing'])) {
            return back()->withErrors(['error' => 'Permohonan sudah diproses (disetujui/ditolak) sebelumnya.']);
        }

        try {
            DB::beginTransaction();

            // Validate existing user
            $existingUser = User::where('email', $accountRequest->email)->first();
            if ($existingUser) {
                throw new \Exception('Email sudah terdaftar pada pengguna lain.');
            }

            $roleName = ucfirst($accountRequest->requested_role);
            $role = Role::where('nama_role', $roleName)->first();
            
            if (!$role || in_array($roleName, ['Admin'])) {
                throw new \Exception('Role tidak valid untuk disetujui melalui sistem permohonan publik.');
            }

            // Create user (inactive, random pass)
            $user = User::create([
                'name' => $accountRequest->nama_lengkap,
                'email' => $accountRequest->email,
                'no_hp' => $accountRequest->nomor_whatsapp,
                'password' => Hash::make(Str::random(40)),
                'id_role' => $role->id_role,
                'status' => 'Nonaktif', // will be active after set password
            ]);

            // Create relation
            if ($roleName === 'Petugas') {
                Petugas::create([
                    'id_user' => $user->id,
                    'nip' => $accountRequest->nip,
                    'jabatan' => $accountRequest->jabatan
                ]);
            } elseif ($roleName === 'Pimpinan') {
                Pimpinan::create([
                    'id_user' => $user->id,
                    'jabatan' => $accountRequest->jabatan
                ]);
            }

            // Generate token
            $token = hash_hmac('sha256', Str::random(40), config('app.key'));

            $accountRequest->update([
                'status' => 'approved',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => Carbon::now(),
                'approved_at' => Carbon::now(),
                'user_id' => $user->id,
                'activation_token' => $token,
                'activation_expires_at' => Carbon::now()->addDays(7),
            ]);

            DB::commit();

            return back()->with('success', 'Permohonan berhasil disetujui. Token aktivasi telah dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyetujui permohonan: ' . $e->getMessage()]);
        }
    }

    public function reject(Request $request, AccountRequest $accountRequest)
    {
        Gate::authorize('users.update');

        $request->validate([
            'rejection_reason' => 'required|string|max:1000'
        ]);

        if (!in_array($accountRequest->status, ['pending', 'reviewing'])) {
            return back()->withErrors(['error' => 'Permohonan sudah diproses sebelumnya, tidak dapat ditolak.']);
        }

        $accountRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Permohonan telah ditolak.');
    }
}
