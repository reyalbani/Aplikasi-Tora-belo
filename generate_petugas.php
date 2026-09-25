<?php
$services = [
    'PPID' => ['name' => 'Layanan PPID', 'path' => 'ppid', 'ctrl' => 'PPIDController', 'react_dir' => 'PPID'],
    'PendidikanPemilih' => ['name' => 'Layanan Pendidikan Pemilih', 'path' => 'pendidikan-pemilih', 'ctrl' => 'PendidikanPemilihController', 'react_dir' => 'PendidikanPemilih'],
    'PengaduanMasyarakat' => ['name' => 'Layanan Pengaduan Masyarakat', 'path' => 'pengaduan-masyarakat', 'ctrl' => 'PengaduanMasyarakatController', 'react_dir' => 'PengaduanMasyarakat'],
    'KerjaSama' => ['name' => 'Layanan Kerjasama', 'path' => 'kerja-sama', 'ctrl' => 'KerjaSamaController', 'react_dir' => 'KerjaSama'],
    'Mutarlih' => ['name' => 'Layanan Pemutakhiran Data Pemilih', 'path' => 'mutarlih', 'ctrl' => 'MutarlihController', 'react_dir' => 'Mutarlih'],
    'Muparpol' => ['name' => 'Layanan Pemutakhiran Data Partai Politik', 'path' => 'muparpol', 'ctrl' => 'MuparpolController', 'react_dir' => 'Muparpol'],
    'PengantaranSurat' => ['name' => 'Pengantaran Surat', 'path' => 'pengantaran-surat', 'ctrl' => 'PengantaranSuratController', 'react_dir' => 'PengantaranSurat'],
    'Konsultasi' => ['name' => 'Konsultasi', 'path' => 'konsultasi', 'ctrl' => 'KonsultasiController', 'react_dir' => 'Konsultasi'],
    'PengaduanPelayanan' => ['name' => 'Layanan Pengaduan Pelayanan', 'path' => 'pengaduan-pelayanan', 'ctrl' => 'PengaduanPelayananController', 'react_dir' => 'PengaduanPelayanan'],
];

// 1. Generate Controllers
$ctrl_template = <<<'TEMPLATE'
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

class {CLASS_NAME} extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');
        
        $query = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', '{SERVICE_NAME}');
            });
            
        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('kode_tiket', 'LIKE', "%{$search}%");
        }
        
        $permohonan = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('petugas/{REACT_DIR}/Index', [
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
        ])->findOrFail($id);

        return Inertia::render('petugas/{REACT_DIR}/Show', [
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
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Status layanan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
TEMPLATE;

if(!is_dir(__DIR__ . '/app/Http/Controllers/Petugas')) {
    mkdir(__DIR__ . '/app/Http/Controllers/Petugas', 0777, true);
}

foreach ($services as $key => $svc) {
    $content = str_replace(
        ['{CLASS_NAME}', '{SERVICE_NAME}', '{REACT_DIR}'], 
        [$svc['ctrl'], $svc['name'], $svc['react_dir']], 
        $ctrl_template
    );
    file_put_contents(__DIR__ . '/app/Http/Controllers/Petugas/' . $svc['ctrl'] . '.php', $content);
}
echo "Controllers created.\n";

// 2. Generate Dashboard Controller
$dashboard_ctrl = <<<'TEMPLATE'
<?php
namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use Inertia\Inertia;

class PetugasDashboardController extends Controller
{
    public function index()
    {
        $aggregates = [];
        
        $services = [
            'Layanan PPID' => 'PPID',
            'Layanan Pendidikan Pemilih' => 'Pendidikan Pemilih',
            'Layanan Pengaduan Masyarakat' => 'Pengaduan Masyarakat',
            'Layanan Kerjasama' => 'Kerja Sama',
            'Layanan Pemutakhiran Data Pemilih' => 'Mutarlih',
            'Layanan Pemutakhiran Data Partai Politik' => 'Muparpol',
            'Pengantaran Surat' => 'Pengantaran Surat',
            'Konsultasi' => 'Konsultasi',
            'Layanan Pengaduan Pelayanan' => 'Pengaduan Pelayanan'
        ];
        
        $data = Permohonan::select('layanan.nama_layanan', \DB::raw('count(*) as total'))
            ->join('layanan', 'permohonan.id_layanan', '=', 'layanan.id_layanan')
            ->whereIn('layanan.nama_layanan', array_keys($services))
            ->groupBy('layanan.nama_layanan')
            ->pluck('total', 'nama_layanan')->toArray();
            
        foreach ($services as $dbName => $label) {
            $aggregates[] = [
                'name' => $label,
                'total' => $data[$dbName] ?? 0
            ];
        }

        return Inertia::render('petugas/Dashboard', [
            'aggregates' => $aggregates
        ]);
    }
}
TEMPLATE;
file_put_contents(__DIR__ . '/app/Http/Controllers/Petugas/PetugasDashboardController.php', $dashboard_ctrl);
echo "Dashboard Controller created.\n";
