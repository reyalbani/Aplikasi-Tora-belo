<?php
$c = file_get_contents("routes/web.php");
$start = strpos($c, "// SIPADU Role-based Routes");
$end = strpos($c, "});", $start) + 3;

$new_block = <<<'PHP'
// SIPADU Role-based Routes
Route::middleware(['auth', 'role:Petugas'])->group(function () {
    Route::get('/petugas/area', [App\Http\Controllers\Petugas\PetugasDashboardController::class, 'index'])->name('petugas.dashboard');

    $petugasServices = [
        'ppid' => App\Http\Controllers\Petugas\PPIDController::class,
        'pendidikan-pemilih' => App\Http\Controllers\Petugas\PendidikanPemilihController::class,
        'pengaduan-masyarakat' => App\Http\Controllers\Petugas\PengaduanMasyarakatController::class,
        'kerja-sama' => App\Http\Controllers\Petugas\KerjaSamaController::class,
        'mutarlih' => App\Http\Controllers\Petugas\MutarlihController::class,
        'muparpol' => App\Http\Controllers\Petugas\MuparpolController::class,
        'pengantaran-surat' => App\Http\Controllers\Petugas\PengantaranSuratController::class,
        'konsultasi' => App\Http\Controllers\Petugas\KonsultasiController::class,
        'pengaduan-pelayanan' => App\Http\Controllers\Petugas\PengaduanPelayananController::class,
    ];

    foreach ($petugasServices as $path => $controller) {
        Route::get('/petugas/' . $path, [$controller, 'index'])->name('petugas.' . $path . '.index');
        Route::get('/petugas/' . $path . '/{id}', [$controller, 'show'])->name('petugas.' . $path . '.show');
        Route::post('/petugas/' . $path . '/{id}/status', [$controller, 'updateStatus'])->name('petugas.' . $path . '.update-status');
    }
});
PHP;

file_put_contents("routes/web.php", substr_replace($c, $new_block, $start, $end - $start));
echo "web.php updated\n";
