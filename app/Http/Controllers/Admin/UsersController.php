<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use App\Services\ActivityLogger;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('users.view');

        $query = User::with('role');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('nama_role', $request->role);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        if (in_array($sortField, ['name', 'email', 'status', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->input('perPage', 10);
        $users = $query->paginate($perPage)->withQueryString();

        $roles = Role::whereIn('nama_role', ['Admin', 'Petugas', 'Pimpinan'])->get();

        $summary = [
            'total' => User::count(),
            'admin' => User::whereHas('role', fn($q) => $q->where('nama_role', 'Admin'))->count(),
            'petugas' => User::whereHas('role', fn($q) => $q->where('nama_role', 'Petugas'))->count(),
            'pimpinan' => User::whereHas('role', fn($q) => $q->where('nama_role', 'Pimpinan'))->count(),
            'aktif' => User::where('status', 'Aktif')->count(),
        ];

        return Inertia::render('admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'status', 'perPage', 'sortField', 'sortDirection']),
            'summary' => $summary
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('users.create');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'id_role' => 'required|exists:roles,id_role',
            'password' => ['required', 'confirmed', Password::defaults()],
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $roleName = Role::find($validated['id_role'])->nama_role;
        if ($roleName === 'Admin') {
            return back()->withErrors(['id_role' => 'Anda tidak diizinkan membuat akun Administrator baru.']);
        }

        $validated['password'] = Hash::make($validated['password']);

        $userRecord = User::create($validated);

        // Create related role record
        $roleName = Role::find($validated['id_role'])->nama_role;
        if ($roleName === 'Admin') {
            \App\Models\Admin::create(['id_user' => $userRecord->id]);
        } elseif ($roleName === 'Petugas') {
            \App\Models\Petugas::create(['id_user' => $userRecord->id]);
        } elseif ($roleName === 'Pimpinan') {
            \App\Models\Pimpinan::create(['id_user' => $userRecord->id]);
        }

        ActivityLogger::log('Membuat Pengguna', 'Manajemen Pengguna', 'Menambahkan pengguna baru: ' . $validated['name'], 'User', $userRecord->id, $validated);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('users.update');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'id_role' => 'required|exists:roles,id_role',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $adminRole = Role::where('nama_role', 'Admin')->first();

        // Prevent admin from deactivating themselves or changing their own role
        if ($user->id === auth()->id()) {
            if ($validated['status'] === 'Nonaktif') {
                return back()->withErrors(['status' => 'Anda tidak dapat menonaktifkan akun Anda sendiri.']);
            }
            if ($validated['id_role'] != $adminRole->id_role && $user->id_role == $adminRole->id_role) {
                 return back()->withErrors(['id_role' => 'Anda tidak dapat mengubah peran Anda sendiri.']);
            }
        } else {
            // Prevent promoting another user to Admin
            if ($validated['id_role'] == $adminRole->id_role && $user->id_role != $adminRole->id_role) {
                return back()->withErrors(['id_role' => 'Anda tidak diizinkan mengangkat pengguna menjadi Administrator.']);
            }
        }

        $oldData = $user->toArray();
        $user->update($validated);

        ActivityLogger::log('Mengubah Pengguna', 'Manajemen Pengguna', 'Memperbarui data pengguna: ' . $user->name, 'User', $user->id, [
            'before' => $oldData,
            'after' => $validated
        ]);

        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function updateStatus(Request $request, User $user)
    {
        Gate::authorize('users.update');

        if ($user->id === auth()->id()) {
            return back()->withErrors(['status' => 'Anda tidak dapat mengubah status Anda sendiri.']);
        }

        $validated = $request->validate([
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $oldStatus = $user->status;
        $user->update($validated);

        ActivityLogger::log('Mengubah Status', 'Manajemen Pengguna', 'Mengubah status pengguna ' . $user->name . ' dari ' . $oldStatus . ' menjadi ' . $validated['status'], 'User', $user->id);

        return back()->with('success', 'Status pengguna berhasil diperbarui.');
    }

    public function resetPassword(Request $request, User $user)
    {
        Gate::authorize('users.update');

        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        ActivityLogger::log('Reset Password', 'Manajemen Pengguna', 'Mereset password pengguna: ' . $user->name, 'User', $user->id);

        return back()->with('success', 'Password pengguna berhasil direset.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('users.delete');

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        $name = $user->name;
        $user->delete();

        ActivityLogger::log('Menghapus Pengguna', 'Manajemen Pengguna', 'Menghapus pengguna: ' . $name, 'User', $user->id);

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
