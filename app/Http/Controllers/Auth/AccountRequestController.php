<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AccountRequest;
use App\Models\SystemSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AccountRequestController extends Controller
{
    public function create()
    {
        $adminPhone = SystemSetting::where('key', 'admin_whatsapp')->value('value') ?? '';
        $adminEmail = SystemSetting::where('key', 'admin_email')->value('value') ?? '';
        
        return inertia('auth/AccountRequest/Create', [
            'contact' => [
                'whatsapp' => $adminPhone,
                'email' => $adminEmail
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'nik' => 'required|string|max:30|unique:account_requests,nik',
            'nip' => 'nullable|string|max:30',
            'email' => 'required|string|email|max:100|unique:users,email|unique:account_requests,email',
            'nomor_whatsapp' => 'required|string|max:20',
            'jabatan' => 'nullable|string|max:100',
            'unit_bagian' => 'nullable|string|max:100',
            'requested_role' => 'required|in:petugas,pimpinan',
            'alasan' => 'required|string|max:1000',
        ], [
            'nik.unique' => 'NIK ini sudah digunakan pada permohonan lain.',
            'email.unique' => 'Email ini sudah terdaftar atau sedang dalam proses permohonan.',
            'requested_role.in' => 'Akses yang dimohon tidak valid.'
        ]);

        $year = date('Y');
        $lastRequest = AccountRequest::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $sequence = $lastRequest ? intval(substr($lastRequest->request_code, -5)) + 1 : 1;
        $requestCode = 'TB-AKUN-' . $year . '-' . str_pad($sequence, 5, '0', STR_PAD_LEFT);

        $validated['request_code'] = $requestCode;
        $validated['status'] = 'pending';

        $accountRequest = AccountRequest::create($validated);

        return redirect()->route('permohonan-akun.success')->with('request_code', $accountRequest->request_code);
    }

    public function success(Request $request)
    {
        $requestCode = session('request_code');
        if (!$requestCode) {
            return redirect()->route('permohonan-akun.create');
        }

        return inertia('auth/AccountRequest/Success', [
            'request_code' => $requestCode
        ]);
    }

    public function status()
    {
        $adminPhone = SystemSetting::where('key', 'admin_whatsapp')->value('value') ?? '';
        $adminEmail = SystemSetting::where('key', 'admin_email')->value('value') ?? '';
        
        return inertia('auth/AccountRequest/Status', [
            'contact' => [
                'whatsapp' => $adminPhone,
                'email' => $adminEmail
            ]
        ]);
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'method' => 'required|in:phone,code',
        ]);

        if ($request->method === 'phone') {
            $request->validate(['phone' => 'required|string']);
            $phone = $request->phone;
            $phone = preg_replace('/[^0-9]/', '', $phone);
            if (str_starts_with($phone, '62')) {
                $phone = '0' . substr($phone, 2);
            }
            
            $query = AccountRequest::where('nomor_whatsapp', $phone);
        } else {
            $request->validate(['request_code' => 'required|string']);
            $query = AccountRequest::where('request_code', $request->request_code);
        }

        $accountRequests = $query->orderBy('id', 'desc')->get()->map(function ($req) {
            return [
                'id' => $req->id,
                'request_code' => $req->request_code,
                'nama_lengkap' => $req->nama_lengkap,
                'nomor_whatsapp' => $req->nomor_whatsapp,
                'requested_role' => $req->requested_role,
                'status' => $req->status,
                'created_at' => $req->created_at,
                'rejection_reason' => $req->rejection_reason,
                'activation_token' => $req->activation_token,
            ];
        });

        $adminPhone = SystemSetting::where('key', 'admin_whatsapp')->value('value') ?? '';
        $adminEmail = SystemSetting::where('key', 'admin_email')->value('value') ?? '';

        return inertia('auth/AccountRequest/StatusResult', [
            'accountRequests' => $accountRequests,
            'method' => $request->method,
            'contact' => [
                'whatsapp' => $adminPhone,
                'email' => $adminEmail
            ]
        ]);
    }

    public function activateForm($token)
    {
        $accountRequest = AccountRequest::where('activation_token', $token)
            ->where('status', 'approved')
            ->firstOrFail();

        if (Carbon::now()->greaterThan($accountRequest->activation_expires_at)) {
            abort(403, 'Token aktivasi telah kedaluwarsa. Silakan hubungi Administrator.');
        }

        return inertia('auth/AccountRequest/Activate', [
            'token' => $token,
            'name' => $accountRequest->nama_lengkap
        ]);
    }

    public function activate(Request $request, $token)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $accountRequest = AccountRequest::where('activation_token', $token)
            ->where('status', 'approved')
            ->firstOrFail();

        if (Carbon::now()->greaterThan($accountRequest->activation_expires_at)) {
            return back()->withErrors(['password' => 'Token aktivasi telah kedaluwarsa.']);
        }

        $user = User::findOrFail($accountRequest->user_id);
        
        // Update user password and activate
        $user->password = Hash::make($request->password);
        $user->status = 'Aktif';
        $user->email_verified_at = Carbon::now();
        $user->save();

        // Clear token
        $accountRequest->activation_token = null;
        $accountRequest->save();

        return redirect('/login')->with('status', 'Akun TORA BELO berhasil diaktifkan. Silakan login.');
    }
}
