<?php
namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use App\Models\StatusPermohonan;
use App\Models\DokumenPermohonan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PengaduanPelayananController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');
        
        $query = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', 'Layanan Pengaduan Pelayanan');
            });
            
        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('kode_tiket', 'LIKE', "%{$search}%");
        }
        
        $permohonan = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('petugas/PengaduanPelayanan/Index', [
            'permohonan' => $permohonan,
            'filters' => [
                'status' => $status,
                'search' => $search
            ]
        ]);
    }

    public function show($id)
    {
        $permohonan = Permohonan::with([
            'masyarakat.user', 
            'layanan', 
            'dokumenPermohonan', 
            'statusPermohonan' => function($q) {
                $q->orderBy('waktu', 'desc');
            }
        ])->find($id);

        return Inertia::render('petugas/PengaduanPelayanan/Show', [
            'permohonan' => $permohonan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'dokumen_lampiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx,zip,rar|max:10240',
        ]);

        try {
            DB::beginTransaction();

            $permohonan = Permohonan::findOrFail($id);
            $permohonan->status = $validated['status'];
            
            $isi = json_decode($permohonan->isi_permohonan, true) ?? [];
            
            if ($request->hasFile('dokumen_lampiran')) {
                $file = $request->file('dokumen_lampiran');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Dokumen Update Petugas',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }
            
            $permohonan->isi_permohonan = json_encode($isi);
            
            if ($validated['status'] == 'Selesai' || $validated['status'] == 'Ditolak') {
                $permohonan->tanggal_selesai = now();
            }
            
            $permohonan->save();

            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? ('Status diperbarui menjadi ' . $validated['status']),
                'waktu' => now(),
                'id_petugas' => auth()->user()->petugas->id_petugas ?? null,
            ]);

            \App\Models\AuditLog::create([
                'id_user' => auth()->id(),
                'aktivitas' => 'Memperbarui status permohonan ' . $permohonan->kode_tiket . ' menjadi ' . $validated['status'],
                'waktu' => now(),
                'ip_address' => request()->ip(),
                'role' => 'Petugas',
                'action' => 'update_status',
                'module' => 'Permohonan',
                'description' => $validated['keterangan'] ?? 'Status updated via Petugas area',
                'subject_type' => get_class($permohonan),
                'subject_id' => $permohonan->id_permohonan,
                'user_agent' => request()->userAgent()
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Status layanan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
