<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Permohonan;
use App\Models\Layanan;
use App\Models\BukuTamu;
use App\Models\SkmResponden;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Global Statistics (Current active state and all time)
        $totalPermohonan = Permohonan::count();
        $sedangDiproses = Permohonan::where('status', 'Diproses')->count();
        $selesai = Permohonan::where('status', 'Selesai')->count();
        $perluTindakLanjut = Permohonan::whereIn('status', ['Baru', 'Menunggu Verifikasi', 'Menunggu Kelengkapan'])->count();

        // 2. Monitoring Layanan
        $layanan = Layanan::all()->map(function ($item) {
            return [
                'id' => $item->id_layanan,
                'nama' => $item->nama_layanan,
                'status' => $item->status ?? 'Tidak Aktif', 
            ];
        });

        // 3. Aktivitas Terbaru
        $recentActivities = AuditLog::with('user')
            ->orderBy('waktu', 'desc')
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id_log,
                    'title' => $log->aktivitas,
                    'actor' => $log->user->name ?? 'Sistem',
                    'time' => $log->waktu ? $log->waktu->diffForHumans() : 'baru saja',
                ];
            });

        // 4. Perlu Tindak Lanjut
        $attentionItems = Permohonan::with(['layanan'])
            ->whereIn('status', ['Baru', 'Menunggu Verifikasi', 'Menunggu Kelengkapan'])
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id_permohonan,
                    'kode' => $p->kode_tiket,
                    'layanan' => $p->layanan->nama_layanan ?? 'Permohonan',
                    'status' => $p->status,
                    'time' => $p->created_at->diffForHumans(),
                ];
            });

        // 5. Chart Data: Tren Permohonan dg Filter Fleksibel
        $period = $request->query('period', '12m'); // hari, minggu, bulan, 3m, 6m, 12m, custom
        $date = $request->query('date', Carbon::now('Asia/Makassar')->format('Y-m-d'));
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $statusFilter = $request->query('status', 'semua');

        $chartData = $this->getTrendChartData($period, $date, $startDate, $endDate, $statusFilter);

        // 6. Chart Data: Status Permohonan (Donut)
        $statusDistribution = Permohonan::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->toArray();
            
        $donutChart = [
            ['name' => 'Baru', 'value' => $statusDistribution['Baru'] ?? 0, 'fill' => '#3b82f6'],
            ['name' => 'Diproses', 'value' => $statusDistribution['Diproses'] ?? 0, 'fill' => '#eab308'],
            ['name' => 'Tertunda', 'value' => ($statusDistribution['Menunggu Verifikasi'] ?? 0) + ($statusDistribution['Menunggu Kelengkapan'] ?? 0), 'fill' => '#f97316'],
            ['name' => 'Selesai', 'value' => $statusDistribution['Selesai'] ?? 0, 'fill' => '#22c55e'],
            ['name' => 'Ditolak', 'value' => $statusDistribution['Ditolak'] ?? 0, 'fill' => '#ef4444'],
        ];

        // 7. Ringkasan Layanan
        $ringkasanLayanan = Layanan::withCount('permohonan')->get()->map(function ($l) use ($totalPermohonan) {
            return [
                'nama' => $l->nama_layanan,
                'total' => $l->permohonan_count,
                'persentase' => $totalPermohonan > 0 ? round(($l->permohonan_count / $totalPermohonan) * 100, 1) : 0
            ];
        })->toArray();
        
        $bukuTamuCount = BukuTamu::count();
        $skmCount = SkmResponden::count();
        $ringkasanLayanan[] = ['nama' => 'Buku Tamu', 'total' => $bukuTamuCount, 'persentase' => null];
        $ringkasanLayanan[] = ['nama' => 'Survei Kepuasan Masyarakat (SKM)', 'total' => $skmCount, 'persentase' => null];
        
        usort($ringkasanLayanan, function($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        // 8. Hitung Total untuk Periode Chart yang sedang Aktif (agar context chart jelas)
        $totalPeriodeAktif = array_reduce($chartData, function($carry, $item) {
            return $carry + ($item['total'] ?? 0);
        }, 0);

        return Inertia::render('dashboard', [
            'dashboardStats' => [
                'total_permohonan' => $totalPermohonan,
                'sedang_diproses' => $sedangDiproses,
                'selesai' => $selesai,
                'perlu_tindak_lanjut' => $perluTindakLanjut,
            ],
            'serviceStats' => $layanan,
            'recentActivities' => $recentActivities,
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
            'lastUpdated' => Carbon::now('Asia/Makassar')->format('H:i:s') . ' WITA',
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
                // To keep chart clean, show labels every 4 hours or all. We'll send all data, Recharts will distribute.
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

    public function unreadNotifications(Request $request) { /* omitted for brevity, keeping same */ 
        $user = auth()->user();
        $unread = $user->unreadNotifications->map(function ($notif) {
            return [
                'id' => $notif->id,
                'title' => $notif->data['title'] ?? 'Notifikasi',
                'message' => $notif->data['message'] ?? '',
                'time' => $notif->created_at->diffForHumans(),
                'is_read' => false,
                'type' => $notif->data['type'] ?? 'info'
            ];
        });
        return response()->json(['notifications' => $unread, 'unread_count' => $unread->count()]);
    }

    public function markNotificationsRead(Request $request) {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['success' => true]);
    }
}
