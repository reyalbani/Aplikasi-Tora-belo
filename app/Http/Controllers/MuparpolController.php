<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PermohonanLayanan;
use App\Models\Layanan;

class MuparpolController extends Controller
{
    public function store(Request $request)
    {
        // Dummy store for now
        return redirect()->back()->with('success', [
            'message' => 'Laporan Pemutakhiran Data Partai Politik berhasil dikirim!'
        ]);
    }
}

