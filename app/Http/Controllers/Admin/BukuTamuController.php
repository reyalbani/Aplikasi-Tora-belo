<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BukuTamu;
use App\Models\Layanan;
use Carbon\Carbon;

class BukuTamuController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $layananId = $request->input('layanan_id');
        $periode = $request->input('periode'); // 'hari_ini', 'minggu_ini', 'bulan_ini'

        $query = BukuTamu::with('layanan')->orderBy('tanggal', 'desc');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('instansi', 'like', "%{$search}%")
                  ->orWhere('keperluan', 'like', "%{$search}%");
            });
        }

        if ($layananId && $layananId !== 'all') {
            $query->where('id_layanan', $layananId);
        }

        if ($periode) {
            $today = Carbon::today();
            if ($periode === 'hari_ini') {
                $query->whereDate('tanggal', $today);
            } elseif ($periode === 'minggu_ini') {
                $query->whereBetween('tanggal', [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()]);
            } elseif ($periode === 'bulan_ini') {
                $query->whereMonth('tanggal', $today->month)->whereYear('tanggal', $today->year);
            }
        }

        $bukuTamu = $query->paginate(10)->withQueryString();

        // Statistics
        $totalKunjungan = BukuTamu::count();
        $kunjunganHariIni = BukuTamu::whereDate('tanggal', Carbon::today())->count();
        $kunjunganBulanIni = BukuTamu::whereMonth('tanggal', Carbon::now()->month)
                                     ->whereYear('tanggal', Carbon::now()->year)
                                     ->count();
        $jumlahLayananDigunakan = BukuTamu::whereNotNull('id_layanan')->distinct('id_layanan')->count('id_layanan');

        // Rekap per Layanan
        $rekapLayanan = Layanan::where('status', 'Aktif')
                                ->whereNotIn('nama_layanan', ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'])
                                ->withCount('bukuTamu')
                                ->get()
                                ->map(function($layanan) {
                                    return [
                                        'nama' => $layanan->nama_layanan,
                                        'jumlah' => $layanan->buku_tamu_count
                                    ];
                                })->sortByDesc('jumlah')->values();

        $layanans = Layanan::where('status', 'Aktif')
                           ->whereNotIn('nama_layanan', ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'])
                           ->get(['id_layanan', 'nama_layanan']);

        return Inertia::render('admin/BukuTamu/Index', [
            'bukuTamu' => $bukuTamu,
            'filters' => [
                'search' => $search,
                'layanan_id' => $layananId,
                'periode' => $periode,
            ],
            'statistics' => [
                'total' => $totalKunjungan,
                'hari_ini' => $kunjunganHariIni,
                'bulan_ini' => $kunjunganBulanIni,
                'layanan_digunakan' => $jumlahLayananDigunakan,
            ],
            'rekapLayanan' => $rekapLayanan,
            'layanans' => $layanans,
        ]);
    }
}
