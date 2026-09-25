<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PermohonanLayanan;
use App\Models\Layanan;

class MutarlihController extends Controller
{
    public function store(Request $request)
    {
        // Dummy store for now
        return redirect()->back()->with('success', [
            'message' => 'Permohonan Pemutakhiran Data Pemilih berhasil dikirim!'
        ]);
    }
}

