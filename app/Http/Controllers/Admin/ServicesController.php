<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Layanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\ActivityLogger;

class ServicesController extends Controller
{
    public function index(Request $request)
    {
        $excluded = ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'];

        $query = Layanan::query()
                    ->whereNotIn('nama_layanan', $excluded)
                    ->withCount('permohonan');

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_layanan', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        $services = $query->orderBy('id_layanan', 'desc')
                          ->paginate(10)
                          ->withQueryString();

        $summary = [
            'total' => Layanan::whereNotIn('nama_layanan', $excluded)->count(),
            'aktif' => Layanan::whereNotIn('nama_layanan', $excluded)->where('status', 'Aktif')->count(),
            'nonaktif' => Layanan::whereNotIn('nama_layanan', $excluded)->where('status', 'Nonaktif')->count(),
        ];

        return Inertia::render('admin/Services/Index', [
            'services' => $services,
            'filters' => $request->only(['search', 'status']),
            'summary' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_layanan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:100',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $layanan = Layanan::create($validated);

        ActivityLogger::log('Membuat Layanan', 'Manajemen Layanan', 'Menambahkan layanan baru: ' . $validated['nama_layanan'], 'Layanan', $layanan->id_layanan, $validated);

        return back()->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function update(Request $request, Layanan $service)
    {
        $validated = $request->validate([
            'nama_layanan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:100',
            'status' => 'required|in:Aktif,Nonaktif',
        ]);

        $oldData = $service->toArray();
        $service->update($validated);

        ActivityLogger::log('Mengubah Layanan', 'Manajemen Layanan', 'Memperbarui layanan: ' . $service->nama_layanan, 'Layanan', $service->id_layanan, [
            'before' => $oldData,
            'after' => $validated
        ]);

        return back()->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Layanan $service)
    {
        // Prevent deletion if it has relations
        if ($service->permohonan()->exists()) {
            return redirect()->back()->withErrors(['error' => 'Layanan tidak dapat dihapus karena memiliki data pengajuan.']);
        }
        
        $nama = $service->nama_layanan;
        $id = $service->id_layanan;
        $service->delete();

        ActivityLogger::log('Menghapus Layanan', 'Manajemen Layanan', 'Menghapus layanan: ' . $nama, 'Layanan', $id);

        return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
    }
}
