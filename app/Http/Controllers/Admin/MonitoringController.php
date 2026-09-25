<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Models\Permohonan;
use App\Models\Layanan;
use App\Models\User;
use App\Models\BukuTamu;
use App\Models\SkmResponden;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MonitoringController extends Controller
{
    public function index(Request $request)
    {
        // Gate::authorize('monitoring.view'); // Skip if gate not strictly enforced yet

        $filter = $request->input('filter', 'all');

        $queryPermohonan = Permohonan::query();

        if ($filter === 'today') {
            $queryPermohonan->whereDate('created_at', Carbon::today());
        } elseif ($filter === 'month') {
            $queryPermohonan->whereMonth('created_at', Carbon::now()->month)
                            ->whereYear('created_at', Carbon::now()->year);
        }

        $totalPermohonan = (clone $queryPermohonan)->count();
        $permohonanBaru = (clone $queryPermohonan)->where('status', 'Menunggu')->count();
        $sedangDiproses = (clone $queryPermohonan)->where('status', 'Diproses')->count();
        $selesai = (clone $queryPermohonan)->where('status', 'Selesai')->count();
        $ditolak = (clone $queryPermohonan)->where('status', 'Ditolak')->count();

        $totalLayanan = Layanan::count();
        $totalPengguna = User::count();
        $totalBukuTamu = BukuTamu::count();
        $totalRespondenSKM = SkmResponden::count();

        // Statistik berdasarkan layanan
        $statistikLayanan = DB::table('permohonan')
            ->join('layanan', 'permohonan.id_layanan', '=', 'layanan.id_layanan')
            ->select('layanan.nama_layanan as name', DB::raw('count(*) as value'))
            ->groupBy('layanan.id_layanan', 'layanan.nama_layanan')
            ->get();

        // Tren permohonan 7 hari terakhir
        $trenWaktu = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Permohonan::whereDate('created_at', $date)->count();
            $trenWaktu[] = [
                'name' => $date->format('d M'),
                'total' => $count
            ];
        }

        // Aktivitas terbaru
        $aktivitasTerbaru = Permohonan::with(['layanan', 'masyarakat'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($p) {
                return [
                    'id' => $p->id_permohonan,
                    'title' => 'Permohonan ' . ($p->layanan->nama_layanan ?? '-'),
                    'description' => 'Tiket ' . $p->kode_tiket . ' telah diupdate menjadi status ' . $p->status,
                    'time' => $p->updated_at->diffForHumans(),
                    'status' => $p->status
                ];
            });

        return Inertia::render('admin/Monitoring/Index', [
            'stats' => [
                'totalPermohonan' => $totalPermohonan,
                'permohonanBaru' => $permohonanBaru,
                'sedangDiproses' => $sedangDiproses,
                'selesai' => $selesai,
                'ditolak' => $ditolak,
                'totalLayanan' => $totalLayanan,
                'totalPengguna' => $totalPengguna,
                'totalBukuTamu' => $totalBukuTamu,
                'totalRespondenSKM' => $totalRespondenSKM,
            ],
            'statistikLayanan' => $statistikLayanan,
            'trenWaktu' => $trenWaktu,
            'aktivitasTerbaru' => $aktivitasTerbaru,
            'filter' => $filter
        ]);
    }
}
