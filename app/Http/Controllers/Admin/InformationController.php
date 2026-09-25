<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Informasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InformationController extends Controller
{
    public function index(Request $request)
    {
        $query = Informasi::query()->with('admin');

        // Filter status
        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // Filter kategori
        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%")
                  ->orWhere('isi', 'like', "%{$search}%")
                  ->orWhere('ringkasan', 'like', "%{$search}%");
            });
        }

        $informations = $query->orderBy('tanggal', 'desc')
                              ->orderBy('id_informasi', 'desc')
                              ->paginate(10)
                              ->withQueryString();

        $summary = [
            'total' => Informasi::count(),
            'published' => Informasi::where('status', 'Published')->orWhere('status', 'Publish')->count(),
            'draft' => Informasi::where('status', 'Draft')->count(),
        ];

        return Inertia::render('admin/Information/Index', [
            'informations' => $informations,
            'filters' => $request->only(['search', 'status', 'kategori']),
            'summary' => $summary,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:150',
            'kategori' => 'required|string|max:100',
            'ringkasan' => 'nullable|string',
            'isi' => 'required|string',
            'status' => 'required|string|max:20',
            'tanggal' => 'required|date',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $validated['id_admin'] = Auth::guard('admin')->id() ?? 1; // Fallback to 1 if not strictly logged in as admin guard, but middleware ensures it.
        $validated['slug'] = Str::slug($validated['judul']) . '-' . time();
        
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('informasi', 'public');
            $validated['gambar'] = $path;
        }

        Informasi::create($validated);

        return redirect()->back()->with('success', 'Informasi berhasil ditambahkan.');
    }

    public function update(Request $request, Informasi $information)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:150',
            'kategori' => 'required|string|max:100',
            'ringkasan' => 'nullable|string',
            'isi' => 'required|string',
            'status' => 'required|string|max:20',
            'tanggal' => 'required|date',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        
        if ($request->judul !== $information->judul) {
            $validated['slug'] = Str::slug($validated['judul']) . '-' . time();
        }

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($information->gambar && Storage::disk('public')->exists($information->gambar)) {
                Storage::disk('public')->delete($information->gambar);
            }
            $path = $request->file('gambar')->store('informasi', 'public');
            $validated['gambar'] = $path;
        }

        $information->update($validated);

        return redirect()->back()->with('success', 'Informasi berhasil diperbarui.');
    }

    public function destroy(Informasi $information)
    {
        if ($information->gambar && Storage::disk('public')->exists($information->gambar)) {
            Storage::disk('public')->delete($information->gambar);
        }
        
        $information->delete();

        return redirect()->back()->with('success', 'Informasi berhasil dihapus.');
    }
}
