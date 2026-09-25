<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Layanan;
use Inertia\Inertia;

class LayananController extends Controller
{
    public function show($id)
    {
        $layanan = Layanan::findOrFail($id);

        if (in_array($layanan->nama_layanan, ['Layanan Pengaduan Pelayanan'])) {
            $componentName = str_replace(' ', '-', strtolower(str_replace('Layanan ', '', $layanan->nama_layanan)));
            return Inertia::render('layanan/' . $componentName, [
                'layanan' => $layanan
            ]);
        }

        return Inertia::render('layanan/buku-tamu', [
            'layanan' => $layanan
        ]);
    }

    public function storeBukuTamu(Request $request, $id)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'nama' => 'required|string|max:100',
            'nomor_whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'instansi' => 'nullable|string|max:100',
        ]);
        
        $bukuTamu = \App\Models\BukuTamu::create([
            'id_layanan' => $id,
            'tanggal' => $request->tanggal,
            'nama' => $request->nama,
            'nomor_whatsapp' => $request->nomor_whatsapp,
            'email' => $request->email,
            'instansi' => $request->instansi,
        ]);
        
        $layanan = Layanan::findOrFail($id);

        session(['buku_tamu_id' => $bukuTamu->id_buku_tamu]);
        session(['buku_tamu_layanan_id' => $id]);
        
        return redirect()->route('layanan.form', ['id' => $id]);
    }

    public function form($id)
    {
        $layanan = Layanan::findOrFail($id);
        
        if (in_array($layanan->nama_layanan, ['Layanan Pengaduan Pelayanan'])) {
            $componentName = str_replace(' ', '-', strtolower(str_replace('Layanan ', '', $layanan->nama_layanan)));
            return Inertia::render('layanan/' . $componentName, [
                'layanan' => $layanan
            ]);
        }

        if (session('buku_tamu_layanan_id') != $id) {
            return redirect()->route('layanan.show', ['id' => $id]);
        }
        
        $layanan = Layanan::findOrFail($id);

        if ($layanan->nama_layanan === 'Pejabat Pengelola Informasi dan Dokumentasi') {
            return Inertia::render('layanan/ppid', [
                'layanan' => $layanan
            ]);
        }

        if ($layanan->nama_layanan === 'Layanan Pengaduan Pelayanan') {
            return Inertia::render('layanan/pengaduan-pelayanan', [
                'layanan' => $layanan
            ]);
        }

        if ($layanan->nama_layanan === 'Layanan Pendidikan Pemilih') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/pendidikan-pemilih', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }
        
        if ($layanan->nama_layanan === 'Layanan Pengaduan Masyarakat') {
            return Inertia::render('layanan/pengaduan-masyarakat', [
                'layanan' => $layanan
            ]);
        }
        
        if ($layanan->nama_layanan === 'Layanan Kerjasama') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/kerjasama', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }


        if ($layanan->nama_layanan === 'Layanan Pemutakhiran Data Pemilih') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/pemutakhiran-data-pemilih', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }


        if ($layanan->nama_layanan === 'Layanan Pemutakhiran Data Partai Politik') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/muparpol', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }
        if ($layanan->nama_layanan === 'Pengantaran Surat' || $layanan->nama_layanan === 'Layanan Pengantaran Surat') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/pengantaran-surat', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }
        
        if ($layanan->nama_layanan === 'Konsultasi' || $layanan->nama_layanan === 'Layanan Konsultasi') {
            $bukuTamu = null;
            if (session('buku_tamu_id')) {
                $bukuTamu = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/konsultasi', [
                'layanan' => $layanan,
                'bukuTamu' => $bukuTamu ? [
                    'nama' => $bukuTamu->nama,
                    'email' => $bukuTamu->email,
                    'no_hp' => $bukuTamu->nomor_whatsapp,
                    'instansi' => $bukuTamu->instansi,
                ] : null,
            ]);
        }

        // For other services
        return Inertia::render('layanan/show', [
            'layanan' => $layanan
        ]);
    }
}

