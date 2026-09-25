<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SkmResponden;
use App\Models\Layanan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SkmController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $layananId = $request->input('layanan_id');
        $periode = $request->input('periode'); // 'hari_ini', 'minggu_ini', 'bulan_ini'

        $query = SkmResponden::with(['permohonan.layanan', 'jawaban.pertanyaan'])->orderBy('tanggal', 'desc');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhereHas('permohonan', function($pq) use ($search) {
                      $pq->where('kode_tiket', 'like', "%{$search}%");
                  });
            });
        }

        if ($layananId && $layananId !== 'all') {
            $query->whereHas('permohonan', function($pq) use ($layananId) {
                $pq->where('id_layanan', $layananId);
            });
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

        $skm = $query->paginate(10)->withQueryString();
        
        // Calculate Nilai and Format Data
        $skmData = tap($skm->getCollection(), function($collection) {
            $collection->transform(function ($item) {
                $totalNilai = 0;
                $jumlahPertanyaan = 0;
                foreach($item->jawaban as $jawaban) {
                    if ($jawaban->pertanyaan && $jawaban->pertanyaan->tipe === 'rating' && $jawaban->nilai) {
                        $totalNilai += $jawaban->nilai;
                        $jumlahPertanyaan++;
                    }
                }
                
                $nilaiRata = $jumlahPertanyaan > 0 ? ($totalNilai / $jumlahPertanyaan) : 0;
                // Asumsi max nilai adalah 4, dikonversi ke skala 100
                $nilaiAkhir = $nilaiRata * 25; 
                
                $item->nilai_akhir = round($nilaiAkhir, 2);
                return $item;
            });
        });
        $skm->setCollection($skmData);

        // Statistics
        $totalResponden = SkmResponden::count();
        $totalSurvey = SkmResponden::count(); // Usually 1 survey per responden
        
        // Calculate Global Nilai SKM
        $semuaJawaban = DB::table('skm_jawaban')
            ->join('skm_pertanyaan', 'skm_jawaban.pertanyaan_id', '=', 'skm_pertanyaan.id')
            ->where('skm_pertanyaan.tipe', 'rating')
            ->whereNotNull('skm_jawaban.nilai')
            ->select('skm_jawaban.nilai', 'skm_jawaban.responden_id')
            ->get();
            
        $nilaiSkm = 0;
        if ($semuaJawaban->count() > 0) {
            $averageRating = $semuaJawaban->avg('nilai');
            $nilaiSkm = round($averageRating * 25, 2);
        }

        // Rekap per Layanan
        $rekapLayanan = Layanan::where('status', 'Aktif')
            ->whereNotIn('nama_layanan', ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'])
            ->get()
            ->map(function($layanan) {
                // Get all responden for this layanan
                $respondenIds = DB::table('skm_responden')
                    ->join('permohonan', 'skm_responden.id_permohonan', '=', 'permohonan.id_permohonan')
                    ->where('permohonan.id_layanan', $layanan->id_layanan)
                    ->pluck('skm_responden.id');
                    
                $jumlahResponden = $respondenIds->count();
                $nilaiLayanan = 0;
                
                if ($jumlahResponden > 0) {
                    $jawabanLayanan = DB::table('skm_jawaban')
                        ->join('skm_pertanyaan', 'skm_jawaban.pertanyaan_id', '=', 'skm_pertanyaan.id')
                        ->whereIn('skm_jawaban.responden_id', $respondenIds)
                        ->where('skm_pertanyaan.tipe', 'rating')
                        ->whereNotNull('skm_jawaban.nilai')
                        ->avg('skm_jawaban.nilai');
                        
                    if ($jawabanLayanan) {
                        $nilaiLayanan = round($jawabanLayanan * 25, 2);
                    }
                }

                return [
                    'nama' => $layanan->nama_layanan,
                    'jumlah' => $jumlahResponden,
                    'nilai' => $nilaiLayanan
                ];
            })->sortByDesc('jumlah')->values();

        $layanans = Layanan::where('status', 'Aktif')
                           ->whereNotIn('nama_layanan', ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'])
                           ->get(['id_layanan', 'nama_layanan']);

        return Inertia::render('admin/SKM/Index', [
            'skm' => $skm,
            'filters' => [
                'search' => $search,
                'layanan_id' => $layananId,
                'periode' => $periode,
            ],
            'statistics' => [
                'total_responden' => $totalResponden,
                'total_survey' => $totalSurvey,
                'nilai_skm' => $nilaiSkm,
                'rata_kepuasan' => $nilaiSkm ? ($nilaiSkm >= 80 ? 'Sangat Baik' : ($nilaiSkm >= 60 ? 'Baik' : 'Cukup')) : '-',
            ],
            'rekapLayanan' => $rekapLayanan,
            'layanans' => $layanans,
        ]);
    }
}

