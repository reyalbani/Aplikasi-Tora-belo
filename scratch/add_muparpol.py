import re

with open('routes/web.php', 'r', encoding='utf-8') as f:
    content = f.read()

route_str = "Route::post('/layanan/muparpol', [App\Http\Controllers\MuparpolController::class, 'store'])->name('muparpol.store');"
if "muparpol.store" not in content:
    content = content.replace("Route::post('/layanan/mutarlih', [App\Http\Controllers\MutarlihController::class, 'store'])->name('mutarlih.store');", 
    "Route::post('/layanan/mutarlih', [App\Http\Controllers\MutarlihController::class, 'store'])->name('mutarlih.store');\n" + route_str)
    
    with open('routes/web.php', 'w', encoding='utf-8') as f:
        f.write(content)

with open('app/Http/Controllers/MuparpolController.php', 'w', encoding='utf-8') as f:
    f.write('''<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PermohonanLayanan;
use App\Models\Layanan;

class MuparpolController extends Controller
{
    public function store(Request )
    {
        // Dummy store for now
        return redirect()->back()->with('success', [
            'message' => 'Laporan Pemutakhiran Data Partai Politik berhasil dikirim!'
        ]);
    }
}
''')

with open('app/Http/Controllers/LayananController.php', 'r', encoding='utf-8') as f:
    content2 = f.read()

if "Layanan Pemutakhiran Data Partai Politik" not in content2:
    insert_str = '''
        if (->nama_layanan === 'Layanan Pemutakhiran Data Partai Politik') {
             = null;
            if (session('buku_tamu_id')) {
                 = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/muparpol', [
                'layanan' => ,
                'bukuTamu' =>  ? [
                    'nama' => ->nama,
                    'email' => ->email,
                    'no_hp' => ->nomor_whatsapp,
                    'instansi' => ->instansi,
                ] : null,
            ]);
        }
'''
    content2 = content2.replace("        // For other services", insert_str + "        // For other services")
    with open('app/Http/Controllers/LayananController.php', 'w', encoding='utf-8') as f:
        f.write(content2)

