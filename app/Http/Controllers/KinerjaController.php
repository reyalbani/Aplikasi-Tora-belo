<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Layanan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class KinerjaController extends Controller
{
    public function getKinerja(Request $request)
    {
        $period = $request->query('period', '1_week');
        $startDate = Carbon::now();

        if ($period === '1_week') {
            $startDate->subWeek();
        } elseif ($period === '1_month') {
            $startDate->subMonth();
        } elseif ($period === '1_year') {
            $startDate->subYear();
        } else {
            $startDate->subWeek(); // fallback
        }

        // Exclude SKM and Buku Tamu
        $layanans = Layanan::whereNotIn('nama_layanan', ['Survei Kepuasan Masyarakat (SKM)', 'Buku Tamu'])->get();

        // Find Permohonans that have been acted upon (verified) by a Petugas in the period
        $verifiedPermohonanIds = DB::table('status_permohonan')
            ->where('waktu', '>=', $startDate)
            ->whereNotNull('id_petugas')
            ->distinct()
            ->pluck('id_permohonan')
            ->toArray();

        // Get counts grouped by layanan
        $counts = DB::table('permohonan')
            ->whereIn('id_permohonan', $verifiedPermohonanIds)
            ->select('id_layanan', DB::raw('count(*) as total'))
            ->groupBy('id_layanan')
            ->pluck('total', 'id_layanan')
            ->toArray();

        $servicesData = [];
        $totalVerified = 0;

        foreach ($layanans as $layanan) {
            $total = 0;
            // PPID is external now, so if no SIPADU data exists, it will naturally be 0.
            if (isset($counts[$layanan->id_layanan])) {
                $total = $counts[$layanan->id_layanan];
            }
            // Clean up name if it contains "Layanan " prefix for cleaner UI
            $cleanName = str_replace('Layanan ', '', $layanan->nama_layanan);

            $servicesData[] = [
                'id_layanan' => $layanan->id_layanan,
                'service_name' => $cleanName,
                'total' => $total
            ];
            $totalVerified += $total;
        }

        // Sort descending by total
        usort($servicesData, function($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_verified' => $totalVerified,
                'period' => $period,
                'services' => $servicesData
            ]
        ]);
    }
}
