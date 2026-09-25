<?php

namespace App\Http\Controllers;

use App\Models\Permohonan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CekStatusController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('cek-status', [
            'initialTiket' => $request->query('tiket', ''),
            'initialPhone' => $request->query('phone', '')
        ]);
    }

    public function show($kode_tiket)
    {
        $permohonan = Permohonan::with(['layanan', 'statusPermohonan' => function($q) {
                $q->orderBy('waktu', 'desc');
            }])
            ->where('kode_tiket', $kode_tiket)
            ->first();

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Kode tiket tidak ditemukan. Periksa kembali kode tiket Anda.'
            ], 404);
        }

        $skmFilled = \App\Models\SkmResponden::where('id_permohonan', $permohonan->id_permohonan)->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'id_permohonan' => $permohonan->id_permohonan,
                'kode_tiket' => $permohonan->kode_tiket,
                'tanggal_pengajuan' => $permohonan->tanggal_pengajuan->toIso8601String(),
                'jenis_layanan' => $permohonan->layanan->nama_layanan ?? 'Layanan',
                'status_saat_ini' => $permohonan->status,
                'skm_filled' => $skmFilled,
                'updated_at' => $permohonan->updated_at->toIso8601String(),
                'timeline' => $permohonan->statusPermohonan->map(function ($status) {
                    return [
                        'status' => $status->status,
                        'keterangan' => $status->keterangan,
                        'waktu' => $status->waktu->toIso8601String(),
                    ];
                }),
            ]
        ]);
    }

    public function showByPhone(Request $request)
    {
        $phoneInput = $request->input('phone');
        if (empty($phoneInput)) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan masukkan nomor telepon.'
            ], 400);
        }

        $phone = preg_replace('/[^0-9\+]/', '', $phoneInput);
        if (empty($phone)) {
            return response()->json([
                'success' => false,
                'message' => 'Format nomor telepon tidak valid.'
            ], 400);
        }

        // Normalize
        $normalizedPhones = [$phone];
        if (str_starts_with($phone, '62')) {
            $normalizedPhones[] = '0' . substr($phone, 2);
            $normalizedPhones[] = '+62' . substr($phone, 2);
        } elseif (str_starts_with($phone, '+62')) {
            $normalizedPhones[] = '0' . substr($phone, 3);
            $normalizedPhones[] = '62' . substr($phone, 3);
        } elseif (str_starts_with($phone, '08')) {
            $normalizedPhones[] = '62' . substr($phone, 1);
            $normalizedPhones[] = '+62' . substr($phone, 1);
        }

        $permohonans = Permohonan::with(['layanan', 'statusPermohonan' => function($q) {
                $q->orderBy('waktu', 'desc');
            }])
            ->whereHas('masyarakat.user', function($q) use ($normalizedPhones) {
                $q->whereIn('no_hp', $normalizedPhones);
            })
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', '!=', 'Pejabat Pengelola Informasi dan Dokumentasi');
            })
            ->orderBy('tanggal_pengajuan', 'desc')
            ->get();

        if ($permohonans->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan dengan nomor telepon tersebut tidak ditemukan.'
            ], 404);
        }

        $formattedData = $permohonans->map(function ($permohonan) {
            $skmFilled = \App\Models\SkmResponden::where('id_permohonan', $permohonan->id_permohonan)->exists();
            return [
                'id_permohonan' => $permohonan->id_permohonan,
                'kode_tiket' => $permohonan->kode_tiket,
                'tanggal_pengajuan' => $permohonan->tanggal_pengajuan->toIso8601String(),
                'jenis_layanan' => $permohonan->layanan->nama_layanan ?? 'Layanan',
                'status_saat_ini' => $permohonan->status,
                'skm_filled' => $skmFilled,
                'updated_at' => $permohonan->updated_at->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }
}
