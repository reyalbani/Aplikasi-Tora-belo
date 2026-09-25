<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Permohonan;
use App\Models\Layanan;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PimpinanController extends Controller
{
    public function dashboard(Request $request)
    {
        $tz = 'Asia/Makassar';
        $period = $request->input('period', '12m');
        $date = $request->input('date', Carbon::now($tz)->format('Y-m-d'));
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');
        $statusFilter = $request->input('status', 'semua');

        // Global Statistics
        $totalPermohonan = Permohonan::count();
        $sedangDiproses = Permohonan::where('status', 'Diproses')->count();
        $selesai = Permohonan::where('status', 'Selesai')->count();
        $baru = Permohonan::where('status', 'Baru')->count();
        $tertunda = Permohonan::whereIn('status', ['Menunggu Verifikasi', 'Menunggu Kelengkapan'])->count();
        $ditolak = Permohonan::where('status', 'Ditolak')->count();
        
        $totalLayanan = Layanan::count();
        $layananAktif = Layanan::where('status', 'Aktif')->count();
        $layananNonAktif = $totalLayanan - $layananAktif;

        // Aktivitas Terbaru
        $recentActivities = AuditLog::with('user')
            ->orderBy('waktu', 'desc')
            ->take(8)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id_log,
                    'title' => $log->aktivitas,
                    'actor' => $log->user->name ?? 'Sistem',
                    'time' => $log->waktu ? $log->waktu->diffForHumans() : 'baru saja',
                    'timestamp' => $log->waktu ? $log->waktu->format('Y-m-d H:i:s') : null,
                ];
            });

        // Service Stats (Monitoring Layanan)
        $serviceStats = Layanan::all()->map(function ($item) {
            return [
                'id' => $item->id_layanan,
                'nama' => $item->nama_layanan,
                'status' => $item->status ?? 'Tidak Aktif', 
            ];
        });

        // Attention Items (Perlu Tindak Lanjut)
        $attentionItems = Permohonan::with(['layanan'])
            ->whereIn('status', ['Baru', 'Menunggu Verifikasi', 'Menunggu Kelengkapan'])
            ->orderBy('created_at', 'asc')
            ->take(5)
            ->get()
            ->map(function($app) {
                return [
                    'id' => $app->id_permohonan,
                    'tiket' => $app->kode_tiket,
                    'layanan' => $app->layanan->nama_layanan ?? '-',
                    'status' => $app->status,
                    'waktu' => $app->created_at ? $app->created_at->diffForHumans() : '',
                ];
            });

        $chartData = $this->getTrendChartData($period, $date, $startDate, $endDate, $statusFilter);

        // Donut Chart Data
        $donutQuery = Permohonan::query();
        if ($period === 'hari') {
            $donutQuery->whereDate('created_at', $date);
        } elseif ($period === 'minggu') {
            $donutQuery->whereBetween('created_at', [Carbon::parse($date, $tz)->startOfWeek(), Carbon::parse($date, $tz)->endOfWeek()]);
        } elseif ($period === 'bulan') {
            $donutQuery->whereMonth('created_at', Carbon::parse($date, $tz)->month)->whereYear('created_at', Carbon::parse($date, $tz)->year);
        } elseif (in_array($period, ['3m', '6m', '12m'])) {
            $months = $period === '3m' ? 3 : ($period === '6m' ? 6 : 12);
            $start = Carbon::now($tz)->startOfMonth()->subMonths($months - 1);
            $end = Carbon::now($tz)->endOfMonth();
            $donutQuery->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $start = Carbon::parse($startDate, $tz)->startOfDay();
            $end = Carbon::parse($endDate, $tz)->endOfDay();
            if ($start->gt($end)) {
                $temp = $start; $start = $end; $end = $temp;
            }
            $donutQuery->whereBetween('created_at', [$start, $end]);
        }

        $donutStats = $donutQuery->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->toArray();

        $donutChart = [
            ['name' => 'Selesai', 'value' => $donutStats['Selesai'] ?? 0, 'color' => '#10b981'],
            ['name' => 'Diproses', 'value' => $donutStats['Diproses'] ?? 0, 'color' => '#3b82f6'],
            ['name' => 'Baru', 'value' => $donutStats['Baru'] ?? 0, 'color' => '#8b5cf6'],
            ['name' => 'Tertunda', 'value' => ($donutStats['Menunggu Verifikasi'] ?? 0) + ($donutStats['Menunggu Kelengkapan'] ?? 0), 'color' => '#f59e0b'],
            ['name' => 'Ditolak', 'value' => $donutStats['Ditolak'] ?? 0, 'color' => '#ef4444'],
        ];

        // Ringkasan Layanan (Bar chart)
        $ringkasanLayanan = Layanan::withCount(['permohonan' => function($q) use ($donutQuery) {
            $bindings = $donutQuery->getBindings();
            $wheres = $donutQuery->getQuery()->wheres;
            foreach ($wheres as $where) {
                if ($where['type'] === 'Basic') {
                    $q->where($where['column'], $where['operator'], $where['value']);
                } elseif ($where['type'] === 'Between') {
                    $q->whereBetween($where['column'], $where['values']);
                }
            }
        }])
        ->orderByDesc('permohonan_count')
        ->take(5)
        ->get()
        ->map(function($l) {
            return [
                'name' => $l->nama_layanan,
                'total' => $l->permohonan_count
            ];
        });

        $totalPeriodeAktif = array_sum(array_column($donutChart, 'value'));

        return Inertia::render('pimpinan/Dashboard', [
            'dashboardStats' => [
                'total' => $totalPermohonan,
                'diproses' => $sedangDiproses,
                'selesai' => $selesai,
                'baru' => $baru,
                'tertunda' => $tertunda,
                'ditolak' => $ditolak,
                'totalLayanan' => $totalLayanan,
                'layananAktif' => $layananAktif,
                'layananNonAktif' => $layananNonAktif
            ],
            'recentActivities' => $recentActivities,
            'serviceStats' => $serviceStats,
            'attentionItems' => $attentionItems,
            'trendChartData' => $chartData,
            'totalPeriodeAktif' => $totalPeriodeAktif,
            'statusChartData' => $donutChart,
            'ringkasanLayanan' => $ringkasanLayanan,
            'filters' => [
                'period' => $period,
                'date' => $date,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $statusFilter,
            ],
            'lastUpdated' => Carbon::now($tz)->format('Y-m-d H:i:s'),
        ]);
    }

    private function getTrendChartData($period, $date, $startDate, $endDate, $status)
    {
        $tz = 'Asia/Makassar';
        $refDate = Carbon::parse($date, $tz);
        $query = Permohonan::query();

        if ($status !== 'semua') {
            if ($status === 'Tertunda') {
                $query->whereIn('status', ['Menunggu Verifikasi', 'Menunggu Kelengkapan']);
            } else {
                $query->where('status', $status);
            }
        }

        $data = [];

        if ($period === 'hari') {
            $start = $refDate->copy()->startOfDay();
            $end = $refDate->copy()->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
            
            $results = $query->select(DB::raw('HOUR(created_at) as hour'), DB::raw('COUNT(*) as total'))
                ->groupBy('hour')
                ->get()
                ->pluck('total', 'hour')
                ->toArray();

            for ($i = 0; $i <= 23; $i++) {
                $data[] = [
                    'label' => sprintf('%02d:00', $i),
                    'total' => $results[$i] ?? 0
                ];
            }
        } elseif ($period === 'minggu') {
            $start = $refDate->copy()->startOfWeek();
            $end = $refDate->copy()->endOfWeek();
            $query->whereBetween('created_at', [$start, $end]);

            $results = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
                ->groupBy('date')
                ->get()
                ->pluck('total', 'date')
                ->toArray();

            $days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
            for ($i = 0; $i < 7; $i++) {
                $curr = $start->copy()->addDays($i);
                $dateStr = $curr->format('Y-m-d');
                $data[] = [
                    'label' => $days[$i],
                    'total' => $results[$dateStr] ?? 0,
                    'full_date' => $curr->format('d M Y')
                ];
            }
        } elseif ($period === 'bulan') {
            $start = $refDate->copy()->startOfMonth();
            $end = $refDate->copy()->endOfMonth();
            $query->whereBetween('created_at', [$start, $end]);

            $results = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
                ->groupBy('date')
                ->get()
                ->pluck('total', 'date')
                ->toArray();

            $daysInMonth = $start->daysInMonth;
            for ($i = 1; $i <= $daysInMonth; $i++) {
                $dateStr = $start->copy()->addDays($i - 1)->format('Y-m-d');
                $data[] = [
                    'label' => (string)$i,
                    'total' => $results[$dateStr] ?? 0,
                    'full_date' => $start->copy()->addDays($i - 1)->format('d M Y')
                ];
            }
        } elseif (in_array($period, ['3m', '6m', '12m'])) {
            $months = $period === '3m' ? 3 : ($period === '6m' ? 6 : 12);
            $start = Carbon::now($tz)->startOfMonth()->subMonths($months - 1);
            $end = Carbon::now($tz)->endOfMonth();
            $query->whereBetween('created_at', [$start, $end]);

            $results = $query->select(DB::raw('YEAR(created_at) as year'), DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as total'))
                ->groupBy('year', 'month')
                ->get();
            
            $map = [];
            foreach ($results as $row) {
                $map[$row->year . '-' . sprintf('%02d', $row->month)] = $row->total;
            }

            for ($i = 0; $i < $months; $i++) {
                $curr = $start->copy()->addMonths($i);
                $key = $curr->format('Y-m');
                $data[] = [
                    'label' => $curr->locale('id')->isoFormat('MMM YY'),
                    'total' => $map[$key] ?? 0,
                    'full_date' => $curr->locale('id')->isoFormat('MMMM YYYY')
                ];
            }
        } elseif ($period === 'custom') {
            if ($startDate && $endDate) {
                $start = Carbon::parse($startDate, $tz)->startOfDay();
                $end = Carbon::parse($endDate, $tz)->endOfDay();
                if ($start->gt($end)) {
                    $temp = $start; $start = $end; $end = $temp;
                }
                $query->whereBetween('created_at', [$start, $end]);

                $diffDays = $start->diffInDays($end);
                
                if ($diffDays <= 31) {
                    $results = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
                        ->groupBy('date')
                        ->get()
                        ->pluck('total', 'date')
                        ->toArray();

                    for ($i = 0; $i <= $diffDays; $i++) {
                        $curr = $start->copy()->addDays($i);
                        $dateStr = $curr->format('Y-m-d');
                        $data[] = [
                            'label' => $curr->format('d/m'),
                            'total' => $results[$dateStr] ?? 0,
                            'full_date' => $curr->format('d M Y')
                        ];
                    }
                } else {
                    $results = $query->select(DB::raw('YEAR(created_at) as year'), DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as total'))
                        ->groupBy('year', 'month')
                        ->get();
                    
                    $map = [];
                    foreach ($results as $row) {
                        $map[$row->year . '-' . sprintf('%02d', $row->month)] = $row->total;
                    }

                    $curr = $start->copy()->startOfMonth();
                    while ($curr->lte($end)) {
                        $key = $curr->format('Y-m');
                        $data[] = [
                            'label' => $curr->locale('id')->isoFormat('MMM YY'),
                            'total' => $map[$key] ?? 0,
                            'full_date' => $curr->locale('id')->isoFormat('MMMM YYYY')
                        ];
                        $curr->addMonth();
                    }
                }
            }
        }
        return $data;
    }
    
    public function monitoringLayanan(Request $request)
    {
        $layanan = Layanan::withCount('permohonan')->get()->map(function ($l) {
            $terbaru = Permohonan::where('id_layanan', $l->id_layanan)->latest('created_at')->first();
            return [
                'id' => $l->id_layanan,
                'nama' => $l->nama_layanan,
                'deskripsi' => $l->deskripsi,
                'status' => $l->status ?? 'Tidak Aktif',
                'total_permohonan' => $l->permohonan_count,
                'terbaru' => $terbaru ? $terbaru->created_at->format('Y-m-d H:i:s') : null,
                'tiket_terbaru' => $terbaru ? $terbaru->kode_tiket : null,
            ];
        });

        return Inertia::render('pimpinan/MonitoringLayanan', [
            'layanan' => $layanan,
            'lastUpdated' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')
        ]);
    }

    public function permohonan(Request $request)
    {
        $query = Permohonan::with(['layanan', 'masyarakat', 'petugas']);
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('kode_tiket', 'like', "%{$search}%")
                  ->orWhereHas('masyarakat', function($q) use ($search) {
                      $q->where('nama_lengkap', 'like', "%{$search}%");
                  });
        }
        
        if ($request->filled('layanan') && $request->layanan !== 'semua') {
            $query->where('id_layanan', $request->layanan);
        }
        
        if ($request->filled('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        $permohonan = $query->latest('created_at')->paginate(10)->withQueryString();
        $layanan = Layanan::select('id_layanan', 'nama_layanan')->get();

        return Inertia::render('pimpinan/Permohonan', [
            'permohonan' => $permohonan,
            'layananList' => $layanan,
            'filters' => $request->only(['search', 'layanan', 'status']),
        ]);
    }
    
    public function apiDetailPermohonan($id)
    {
        try {
            $permohonan = \App\Models\Permohonan::with([
                'layanan', 
                'masyarakat.user', 
                'petugas',
                'dokumenPermohonan',
                'statusPermohonan' => function($q) {
                    $q->orderBy('waktu', 'desc');
                }
            ])->findOrFail($id);
            return response()->json(['success' => true, 'data' => $permohonan]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Permohonan tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function detailPermohonan($id)
    {
        $permohonan = Permohonan::with([
            'layanan', 
            'masyarakat', 
            'petugas',
            'dokumenPermohonan',
            'statusPermohonan' => function($q) {
                $q->orderBy('waktu', 'desc');
            }
        ])->findOrFail($id);
        
        return Inertia::render('pimpinan/DetailPermohonan', [
            'permohonan' => $permohonan
        ]);
    }

    public function lihatLampiran(Request $request, $id, $lampiranId)
    {
        $permohonan = Permohonan::findOrFail($id);
        
        $lampiran = \App\Models\DokumenPermohonan::where('id_dokumen', $lampiranId)
            ->where('id_permohonan', $id)
            ->firstOrFail();

        $path = $lampiran->path_file;
        
        // Remove storage/ from path if it's there
        if (\Illuminate\Support\Str::startsWith($path, 'storage/')) {
            $path = substr($path, 8); // remove 'storage/'
        }

        // Check if file exists in the storage disk
        if (\Illuminate\Support\Facades\Storage::disk('local')->exists($path)) {
             $fullPath = \Illuminate\Support\Facades\Storage::disk('local')->path($path);
        } elseif (\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
             $fullPath = \Illuminate\Support\Facades\Storage::disk('public')->path($path);
        } elseif (\Illuminate\Support\Facades\Storage::disk('local')->exists('public/' . $path)) {
             $fullPath = \Illuminate\Support\Facades\Storage::disk('local')->path('public/' . $path);
        } elseif (\Illuminate\Support\Facades\Storage::disk('public')->exists('dokumen_permohonan/' . $path)) {
             $fullPath = \Illuminate\Support\Facades\Storage::disk('public')->path('dokumen_permohonan/' . $path);
        } elseif (file_exists(storage_path('app/public/' . $path))) {
             $fullPath = storage_path('app/public/' . $path);
        } elseif (file_exists(storage_path('app/public/dokumen_permohonan/' . basename($path)))) {
             $fullPath = storage_path('app/public/dokumen_permohonan/' . basename($path));
        } else {
             return abort(404, 'File lampiran tidak ditemukan di server.');
        }

        $mimeType = \Illuminate\Support\Facades\File::mimeType($fullPath);

        // Check if download is requested
        if ($request->query('download')) {
            return response()->download($fullPath, $lampiran->nama_file, [
                'Content-Type' => $mimeType
            ]);
        }

        // Display inline for images and PDFs
        if (str_starts_with($mimeType, 'image/') || $mimeType === 'application/pdf') {
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $lampiran->nama_file . '"'
            ]);
        }

        // Download for others
        return response()->download($fullPath, $lampiran->nama_file, [
            'Content-Type' => $mimeType
        ]);
    }

    private function getLaporanData(Request $request)
    {
        $tz = 'Asia/Makassar';
        $period = $request->input('period', 'bulan');
        $layananId = $request->input('layanan', 'semua');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');

        $query = Permohonan::with(['layanan', 'masyarakat', 'petugas']);

        // Filter Layanan
        if ($layananId !== 'semua') {
            $query->where('id_layanan', $layananId);
        }

        // Filter Periode
        $start = null;
        $end = null;
        $now = Carbon::now($tz);

        if ($period === 'hari') {
            $start = $now->copy()->startOfDay();
            $end = $now->copy()->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'minggu') {
            $start = $now->copy()->startOfWeek();
            $end = $now->copy()->endOfWeek();
            $query->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'bulan') {
            $start = $now->copy()->startOfMonth();
            $end = $now->copy()->endOfMonth();
            $query->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'tahun') {
            $start = $now->copy()->startOfYear();
            $end = $now->copy()->endOfYear();
            $query->whereBetween('created_at', [$start, $end]);
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $start = Carbon::parse($startDate, $tz)->startOfDay();
            $end = Carbon::parse($endDate, $tz)->endOfDay();
            if ($start->gt($end)) {
                $temp = $start; $start = $end; $end = $temp;
            }
            $query->whereBetween('created_at', [$start, $end]);
        }

        $permohonan = $query->orderBy('created_at', 'desc')->get();

        // Rekapitulasi per layanan
        $layananList = Layanan::all();
        $rekapLayanan = [];
        
        $totalAll = 0; $baruAll = 0; $diprosesAll = 0; $selesaiAll = 0; $ditolakAll = 0; $tertundaAll = 0;

        foreach ($layananList as $l) {
            if ($layananId !== 'semua' && $l->id_layanan != $layananId) {
                continue;
            }

            $p = $permohonan->where('id_layanan', $l->id_layanan);
            $total = $p->count();
            
            if ($total == 0 && $layananId == 'semua') {
                continue; // Skip empty in global summary
            }

            $baru = $p->where('status', 'Baru')->count();
            $diproses = $p->where('status', 'Diproses')->count();
            $selesai = $p->where('status', 'Selesai')->count();
            $ditolak = $p->where('status', 'Ditolak')->count();
            $tertunda = $p->whereIn('status', ['Menunggu Verifikasi', 'Menunggu Kelengkapan'])->count();

            $totalAll += $total;
            $baruAll += $baru;
            $diprosesAll += $diproses;
            $selesaiAll += $selesai;
            $ditolakAll += $ditolak;
            $tertundaAll += $tertunda;

            $rekapLayanan[] = [
                'layanan' => $l->nama_layanan,
                'baru' => $baru,
                'diproses' => $diproses,
                'selesai' => $selesai,
                'ditolak' => $ditolak,
                'tertunda' => $tertunda,
                'total' => $total
            ];
        }

        $ringkasan = [
            'total' => $totalAll,
            'baru' => $baruAll,
            'diproses' => $diprosesAll,
            'selesai' => $selesaiAll,
            'ditolak' => $ditolakAll,
            'tertunda' => $tertundaAll,
        ];

        return [
            'permohonan' => $permohonan,
            'rekapLayanan' => $rekapLayanan,
            'ringkasan' => $ringkasan,
            'layananList' => $layananList,
            'period' => $period,
            'start' => $start,
            'end' => $end,
        ];
    }

    public function laporan(Request $request)
    {
        $data = $this->getLaporanData($request);
        $permohonan = $data['permohonan'];
        
        // Generate trend chart data
        $trendMap = [];
        $period = $data['period'];
        $tz = 'Asia/Makassar';
        
        foreach ($permohonan as $p) {
            $date = \Carbon\Carbon::parse($p->created_at)->timezone($tz);
            $key = $date->format('Y-m-d');
            
            if ($period === 'hari') {
                $key = $date->format('H:00');
            } elseif ($period === 'tahun') {
                $key = $date->locale('id')->isoFormat('MMM YYYY');
            }
            
            if (!isset($trendMap[$key])) {
                $trendMap[$key] = 0;
            }
            $trendMap[$key]++;
        }
        
        $trendChartData = [];
        foreach ($trendMap as $label => $total) {
            $trendChartData[] = [
                'label' => $label,
                'total' => $total
            ];
        }
        
        // Sort trend chart data by date if necessary, but keys might need sorting
        if ($period !== 'hari') {
            // Sort keys
            // It's easier if we just rely on the order, but let's just reverse because permohonan is desc
            $trendChartData = array_reverse($trendChartData);
        } else {
            ksort($trendMap);
            $trendChartData = [];
            foreach ($trendMap as $label => $total) {
                $trendChartData[] = ['label' => $label, 'total' => $total];
            }
        }

        // Status Chart Data
        $statusMap = [
            'Selesai' => ['color' => '#10b981', 'value' => 0],
            'Diproses' => ['color' => '#3b82f6', 'value' => 0],
            'Baru' => ['color' => '#8b5cf6', 'value' => 0],
            'Tertunda' => ['color' => '#f59e0b', 'value' => 0],
            'Ditolak' => ['color' => '#ef4444', 'value' => 0],
        ];
        
        foreach ($permohonan as $p) {
            if (in_array($p->status, ['Menunggu Verifikasi', 'Menunggu Kelengkapan'])) {
                $statusMap['Tertunda']['value']++;
            } elseif (isset($statusMap[$p->status])) {
                $statusMap[$p->status]['value']++;
            }
        }
        
        $statusChartData = [];
        foreach ($statusMap as $name => $item) {
            $statusChartData[] = [
                'name' => $name,
                'value' => $item['value'],
                'color' => $item['color']
            ];
        }

        return Inertia::render('pimpinan/Laporan', [
            'ringkasan' => $data['ringkasan'],
            'rekapLayanan' => $data['rekapLayanan'],
            'layananList' => $data['layananList'],
            'filters' => $request->only(['period', 'start_date', 'end_date', 'layanan']),
            'trendChartData' => $trendChartData,
            'statusChartData' => $statusChartData,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $data = $this->getLaporanData($request);
        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\LaporanExport(
                $data['permohonan'], 
                $data['rekapLayanan'], 
                $data['period'], 
                $data['start'], 
                $data['end']
            ), 
            'laporan-sipadu-' . time() . '.xlsx'
        );
    }

    public function exportPdf(Request $request)
    {
        $data = $this->getLaporanData($request);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.laporan', [
            'permohonan' => $data['permohonan'],
            'rekapLayanan' => $data['rekapLayanan'],
            'period' => $data['period'],
            'start' => $data['start'],
            'end' => $data['end'],
        ]);
        
        return $pdf->download('laporan-sipadu-' . time() . '.pdf');
    }

    public function aktivitas(Request $request)
    {
        $query = AuditLog::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('aktivitas', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('tanggal')) {
            $tz = 'Asia/Makassar';
            $start = Carbon::parse($request->tanggal, $tz)->startOfDay();
            $end = Carbon::parse($request->tanggal, $tz)->endOfDay();
            $query->whereBetween('waktu', [$start, $end]);
        }

        if ($request->filled('modul') && $request->modul !== 'semua') {
            $query->where('module', $request->modul);
        }

        $activities = $query->orderBy('waktu', 'desc')->paginate(15);
        $modules = AuditLog::select('module')->distinct()->pluck('module')->filter();

        return Inertia::render('pimpinan/Aktivitas', [
            'activities' => $activities,
            'filters' => $request->only(['search', 'tanggal', 'modul']),
            'modules' => $modules,
        ]);
    }
}
