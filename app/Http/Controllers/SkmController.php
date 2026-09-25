<?php

namespace App\Http\Controllers;

use App\Models\Permohonan;
use App\Models\SkmResponden;
use App\Models\SkmPertanyaan;
use App\Models\SkmJawaban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkmController extends Controller
{
    public function create($kode_tiket)
    {
        $permohonan = Permohonan::with('layanan')->where('kode_tiket', $kode_tiket)->firstOrFail();

        if (strtolower($permohonan->status) !== 'selesai') {
            return redirect()->route('cek-status.index')->with('error', 'Tiket belum selesai, tidak dapat mengisi SKM.');
        }

        $skmFilled = SkmResponden::where('id_permohonan', $permohonan->id_permohonan)->exists();
        if ($skmFilled) {
            return redirect()->route('cek-status.index')->with('error', 'SKM untuk tiket ini sudah diisi.');
        }

        // Just fetch the active questions. 
        // If empty, we can just use the frontend hardcoded ones based on instruction, or pass them from backend.
        // Actually the instructions gave us exactly 10 questions.
        // Let's pass the permohonan data to frontend.
        return Inertia::render('skm/form', [
            'permohonan' => [
                'id_permohonan' => $permohonan->id_permohonan,
                'kode_tiket' => $permohonan->kode_tiket,
                'jenis_layanan' => $permohonan->layanan->nama_layanan ?? 'Layanan',
                'id_masyarakat' => $permohonan->id_masyarakat,
            ]
        ]);
    }

    public function store(Request $request, $kode_tiket)
    {
        $permohonan = Permohonan::with('masyarakat.user')->where('kode_tiket', $kode_tiket)->firstOrFail();

        if (strtolower($permohonan->status) !== 'selesai') {
            abort(403, 'Tiket belum selesai.');
        }

        $skmFilled = SkmResponden::where('id_permohonan', $permohonan->id_permohonan)->exists();
        if ($skmFilled) {
            abort(400, 'SKM sudah diisi.');
        }

        $request->validate([
            'email' => 'required|email',
            'tanggal_survei' => 'required|date',
            'jam_survei' => 'required',
            'nomor_hp' => 'nullable|string',
            'usia' => 'required|string',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'domisili' => 'nullable|string',
            'pendidikan' => 'required|string',
            'pekerjaan' => 'nullable|string',
            'saran' => 'required|string',
            'jawaban' => 'required|array',
            'jawaban.*' => 'required|integer|min:1|max:4',
        ]);

        $responden = SkmResponden::create([
            'id_masyarakat' => $permohonan->id_masyarakat,
            'id_permohonan' => $permohonan->id_permohonan,
            'nama' => $permohonan->masyarakat->user->name ?? null,
            'email' => $request->email,
            'nomor_hp' => $request->nomor_hp,
            'usia' => $request->usia,
            'jenis_kelamin' => $request->jenis_kelamin,
            'domisili' => $request->domisili,
            'pendidikan' => $request->pendidikan,
            'pekerjaan' => $request->pekerjaan,
            'saran' => $request->saran,
            'tanggal' => $request->tanggal_survei,
            'jam_survei' => $request->jam_survei,
        ]);

        // Save answers
        foreach ($request->jawaban as $qId => $nilai) {
            SkmJawaban::create([
                'responden_id' => $responden->id,
                'pertanyaan_id' => $qId, // frontend can just send 1 to 9 as IDs
                'nilai' => $nilai,
            ]);
        }

        return redirect()->route('cek-status.index', ['tiket' => $kode_tiket])
                         ->with('success', 'Terima kasih, survei Anda telah berhasil dikirim.');
    }
}
