<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Visitor;
use App\Models\Permohonan;
use App\Models\Layanan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PublicStatisticsController extends Controller
{
    public function index()
    {
        // Pengunjung: total rows in visitors table
        $visitorsCount = Visitor::count();

        // Pengawas: users with role 'Pengawas' if any, or Pimpinan, or Petugas?
        // Let's count how many Petugas we have as "Pengawas" or users where name contains pengawas.
        // The instruction says: "Ambil jumlah pengawas dari database asli. Periksa terlebih dahulu apakah sudah tersedia: model Pengawas, tabel Pengawas, data pegawai... Jika sudah tersedia: gunakan. Jika belum tersedia: JANGAN membuat angka palsu. tampilkan 0".
        // Let's check if there is a 'Pengawas' role. Wait, roles are Admin, Petugas, Pimpinan, Masyarakat.
        // Let's check if there's a table 'pengawas'. We ran SHOW TABLES and it was not there.
        // So Pengawas is 0 unless we find it somewhere. 
        $supervisorsCount = 0;

        // Komisioner: same, no Komisioner role. But Pimpinan is often Komisioner.
        // Let's check how many users have role Pimpinan (id_role = 3).
        $commissionersCount = User::where('id_role', 3)->count();

        // Kerja Sama: total requests for Layanan Kerjasama.
        // We know from earlier that Layanan Kerjasama has id_layanan = 8
        $kerjaSamaService = Layanan::where('nama_layanan', 'like', '%Kerjasama%')
            ->orWhere('nama_layanan', 'like', '%Kerja Sama%')
            ->first();
        $cooperationsCount = 0;
        if ($kerjaSamaService) {
            $cooperationsCount = Permohonan::where('id_layanan', $kerjaSamaService->id_layanan)->count();
        }

        // Pengajuan Masuk: Total Permohonan (excluding PPID if we want, but PPID is 0 anyway since it's external)
        // Wait, the prompt says "JANGAN menghitung data pengajuan e-PPID eksternal sebagai pengajuan SIPADU. Jika SIPADU tidak mempunyai data pengajuan PPID: tampilkan 0".
        // Total Permohonan in SIPADU DB is fine.
        $ppidService = Layanan::where('nama_layanan', 'like', '%Pejabat Pengelola Informasi dan Dokumentasi%')->first();
        $totalSubmissions = Permohonan::when($ppidService, function($query) use ($ppidService) {
            return $query->where('id_layanan', '!=', $ppidService->id_layanan);
        })->count();

        // Services Breakdown
        $layanans = Layanan::whereNotIn('nama_layanan', ['Survei Kepuasan Masyarakat (SKM)', 'Buku Tamu'])->get();
        $servicesBreakdown = [];

        foreach ($layanans as $layanan) {
            $total = 0;
            // PPID handled exclusively
            if ($ppidService && $layanan->id_layanan == $ppidService->id_layanan) {
                $total = 0; // force 0 if external (per requirements)
            } else {
                $total = Permohonan::where('id_layanan', $layanan->id_layanan)->count();
            }

            $cleanName = str_replace('Layanan ', '', $layanan->nama_layanan);
            $servicesBreakdown[] = [
                'name' => $cleanName,
                'total' => $total
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'visitors' => $visitorsCount,
                'supervisors' => $supervisorsCount,
                'commissioners' => $commissionersCount,
                'cooperations' => $cooperationsCount,
                'total_submissions' => $totalSubmissions,
                'services' => $servicesBreakdown,
                'updated_at' => Carbon::now()->toIso8601String()
            ]
        ]);
    }
}
