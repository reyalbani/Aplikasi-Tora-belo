<?php
namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use Inertia\Inertia;

class PetugasDashboardController extends Controller
{
    public function index()
    {
        $services = [
            'Pejabat Pengelola Informasi dan Dokumentasi' => 'PPID',
            'Layanan Pendidikan Pemilih' => 'Pendidikan Pemilih',
            'Layanan Pengaduan Masyarakat' => 'Pengaduan Masyarakat',
            'Layanan Kerjasama' => 'Kerja Sama',
            'Layanan Pemutakhiran Data Pemilih' => 'Mutarlih',
            'Layanan Pemutakhiran Data Partai Politik' => 'Muparpol',
            'Pengantaran Surat' => 'Pengantaran Surat',
            'Konsultasi' => 'Konsultasi',
            'Layanan Pengaduan Pelayanan' => 'Pengaduan Pelayanan'
        ];
        
        // Summary stats
        $stats = [
            'total' => Permohonan::count(),
            'baru' => Permohonan::where('status', 'Baru')->count(),
            'diproses' => Permohonan::where('status', 'Diproses')->count(),
            'menunggu_kelengkapan' => Permohonan::where('status', 'Menunggu Kelengkapan')->count(),
            'selesai' => Permohonan::where('status', 'Selesai')->count(),
            'ditolak' => Permohonan::where('status', 'Ditolak')->count(),
        ];

        // Service summary
        $serviceStatsQuery = Permohonan::select('layanan.nama_layanan', 
            \DB::raw('count(*) as total'),
            \DB::raw('sum(case when permohonan.status = "Baru" then 1 else 0 end) as baru'),
            \DB::raw('sum(case when permohonan.status = "Diproses" then 1 else 0 end) as diproses'),
            \DB::raw('sum(case when permohonan.status = "Selesai" then 1 else 0 end) as selesai'),
            \DB::raw('sum(case when permohonan.status = "Menunggu Kelengkapan" then 1 else 0 end) as tertunda')
        )
            ->join('layanan', 'permohonan.id_layanan', '=', 'layanan.id_layanan')
            ->whereIn('layanan.nama_layanan', array_keys($services))
            ->groupBy('layanan.nama_layanan')
            ->get()
            ->keyBy('nama_layanan');

        $aggregates = [];
        foreach ($services as $dbName => $label) {
            $row = $serviceStatsQuery->get($dbName);
            $aggregates[] = [
                'name' => $label,
                'total' => $row ? $row->total : 0,
                'baru' => $row ? $row->baru : 0,
                'diproses' => $row ? $row->diproses : 0,
                'selesai' => $row ? $row->selesai : 0,
                'tertunda' => $row ? $row->tertunda : 0,
            ];
        }

        // Priority tickets (Baru or Menunggu)
        $priorityTickets = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereIn('status', ['Baru', 'Menunggu Kelengkapan'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Recent activities by Petugas
        $recentActivities = \App\Models\AuditLog::with('user')
            ->where('role', 'Petugas')
            ->orderBy('waktu', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('petugas/Dashboard', [
            'stats' => $stats,
            'aggregates' => $aggregates,
            'priorityTickets' => $priorityTickets,
            'recentActivities' => $recentActivities,
        ]);
    }
}
