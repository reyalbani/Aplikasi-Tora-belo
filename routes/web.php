<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

use App\Models\Layanan;
use App\Models\Informasi;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Visitor;

Route::get('/', function (Request $request) {
    try {
        Visitor::updateOrCreate([
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? 'unknown', 0, 255),
            'visit_date' => Carbon::now()->toDateString()
        ]);
    } catch (\Exception $e) {
        // Ignore duplicate entry or db errors so it doesn't crash the homepage
    }

    $services = Layanan::where('status', 'Aktif')
        ->whereNotIn('nama_layanan', ['Buku Tamu', 'Survei Kepuasan Masyarakat (SKM)'])
        ->get();
        
    $informasi = Informasi::whereIn('status', ['Publish', 'Published'])
        ->orderBy('tanggal', 'desc')
        ->take(6)
        ->get();

    return inertia('welcome', [
        'services' => $services,
        'informasi' => $informasi
    ]);
})->name('home');

Route::get('/informasi/{slug}', [App\Http\Controllers\PublicInformationController::class, 'show'])->name('informasi.show');
Route::get('/layanan/{id}', [App\Http\Controllers\LayananController::class, 'show'])->name('layanan.show');
Route::post('/layanan/{id}/buku-tamu', [App\Http\Controllers\LayananController::class, 'storeBukuTamu'])->name('layanan.buku-tamu.store');
Route::get('/layanan/{id}/form', [App\Http\Controllers\LayananController::class, 'form'])->name('layanan.form');
Route::post('/layanan/ppid', [App\Http\Controllers\PPIDController::class, 'store'])->name('ppid.store');
Route::post('/layanan/pengaduan-pelayanan', [App\Http\Controllers\PengaduanPelayananController::class, 'store'])->name('pengaduan-pelayanan.store');
Route::post('/layanan/pendidikan-pemilih', [App\Http\Controllers\PendidikanPemilihController::class, 'store'])->name('pendidikan-pemilih.store');
Route::post('/layanan/pengaduan-masyarakat', [App\Http\Controllers\PengaduanMasyarakatController::class, 'store'])->name('pengaduan-masyarakat.store');
Route::post('/layanan/kerjasama', [App\Http\Controllers\KerjasamaController::class, 'store'])->name('kerjasama.store');
Route::post('/layanan/mutarlih', [App\Http\Controllers\MutarlihController::class, 'store'])->name('mutarlih.store');
Route::post('/layanan/muparpol', [App\Http\Controllers\MuparpolController::class, 'store'])->name('muparpol.store');
Route::post('/layanan/pengantaran-surat', [App\Http\Controllers\PengantaranSuratController::class, 'store'])->name('pengantaran-surat.store');
Route::post('/layanan/konsultasi', [App\Http\Controllers\KonsultasiController::class, 'store'])->name('konsultasi.store');


Route::get('/cek-status', [App\Http\Controllers\CekStatusController::class, 'index'])->name('cek-status.index');
Route::get('/cek-status/api/{kode_tiket}', [App\Http\Controllers\CekStatusController::class, 'show'])->name('cek-status.api');
Route::post('/cek-status/api/phone', [App\Http\Controllers\CekStatusController::class, 'showByPhone'])->name('cek-status.api.phone');

Route::get('/skm/{kode_tiket}', [App\Http\Controllers\SkmController::class, 'create'])->name('skm.create');
Route::post('/skm/{kode_tiket}', [App\Http\Controllers\SkmController::class, 'store'])->name('skm.store');

Route::get('/api/kinerja', [App\Http\Controllers\KinerjaController::class, 'getKinerja'])->name('api.kinerja');
Route::get('/api/public/statistics', [App\Http\Controllers\PublicStatisticsController::class, 'index'])->name('api.public.statistics');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $role = auth()->user()->role->nama_role ?? '';
        
        switch ($role) {
            case 'Admin':
                return redirect('/admin/area');
            case 'Petugas':
                return redirect('/petugas/area');
            case 'Pimpinan':
                return redirect('/pimpinan/area');
            case 'Masyarakat':
                return redirect('/');
            default:
                abort(403, 'Unauthorized role.');
        }
    })->name('dashboard');
});

Route::middleware(['guest'])->group(function () {
    Route::get('/permohonan-akun', [App\Http\Controllers\Auth\AccountRequestController::class, 'create'])->name('permohonan-akun.create');
    Route::post('/permohonan-akun', [App\Http\Controllers\Auth\AccountRequestController::class, 'store'])->name('permohonan-akun.store');
    
    Route::get('/permohonan-akun/berhasil', [App\Http\Controllers\Auth\AccountRequestController::class, 'success'])->name('permohonan-akun.success');
    
    Route::get('/permohonan-akun/status', [App\Http\Controllers\Auth\AccountRequestController::class, 'status'])->name('permohonan-akun.status');
    Route::post('/permohonan-akun/status', [App\Http\Controllers\Auth\AccountRequestController::class, 'checkStatus'])->name('permohonan-akun.check-status')->middleware('throttle:10,1');

    
    Route::get('/aktivasi-akun/{token}', [App\Http\Controllers\Auth\AccountRequestController::class, 'activateForm'])->name('aktivasi-akun.form');
    Route::post('/aktivasi-akun/{token}', [App\Http\Controllers\Auth\AccountRequestController::class, 'activate'])->name('aktivasi-akun.activate');
});

require __DIR__.'/settings.php';

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


Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/admin/area', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/notifications/unread', [App\Http\Controllers\Admin\AdminDashboardController::class, 'unreadNotifications'])->name('admin.notifications.unread');
    Route::post('/admin/notifications/mark-read', [App\Http\Controllers\Admin\AdminDashboardController::class, 'markNotificationsRead'])->name('admin.notifications.mark-read');

    // Manajemen Pengguna
    Route::get('/admin/users', [App\Http\Controllers\Admin\UsersController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [App\Http\Controllers\Admin\UsersController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [App\Http\Controllers\Admin\UsersController::class, 'update'])->name('admin.users.update');
    Route::post('/admin/users/{user}/status', [App\Http\Controllers\Admin\UsersController::class, 'updateStatus'])->name('admin.users.update-status');
    Route::post('/admin/users/{user}/reset-password', [App\Http\Controllers\Admin\UsersController::class, 'resetPassword'])->name('admin.users.reset-password');
    Route::delete('/admin/users/{user}', [App\Http\Controllers\Admin\UsersController::class, 'destroy'])->name('admin.users.destroy');

    // Permohonan Akun
    Route::get('/admin/account-requests', [App\Http\Controllers\Admin\AccountRequestController::class, 'index'])->name('admin.account-requests.index');
    Route::get('/admin/account-requests/{accountRequest}', [App\Http\Controllers\Admin\AccountRequestController::class, 'show'])->name('admin.account-requests.show');
    Route::post('/admin/account-requests/{accountRequest}/approve', [App\Http\Controllers\Admin\AccountRequestController::class, 'approve'])->name('admin.account-requests.approve');
    Route::post('/admin/account-requests/{accountRequest}/reject', [App\Http\Controllers\Admin\AccountRequestController::class, 'reject'])->name('admin.account-requests.reject');

    // Manajemen Layanan
    Route::get('/admin/services', [App\Http\Controllers\Admin\ServicesController::class, 'index'])->name('admin.services.index');
    Route::post('/admin/services', [App\Http\Controllers\Admin\ServicesController::class, 'store'])->name('admin.services.store');
    Route::put('/admin/services/{service}', [App\Http\Controllers\Admin\ServicesController::class, 'update'])->name('admin.services.update');
    Route::delete('/admin/services/{service}', [App\Http\Controllers\Admin\ServicesController::class, 'destroy'])->name('admin.services.destroy');

    // Manajemen Informasi
    Route::get('/admin/information', [App\Http\Controllers\Admin\InformationController::class, 'index'])->name('admin.information.index');
    Route::post('/admin/information', [App\Http\Controllers\Admin\InformationController::class, 'store'])->name('admin.information.store');
    Route::put('/admin/information/{information}', [App\Http\Controllers\Admin\InformationController::class, 'update'])->name('admin.information.update');
    Route::delete('/admin/information/{information}', [App\Http\Controllers\Admin\InformationController::class, 'destroy'])->name('admin.information.destroy');

    // Layanan -> Buku Tamu
    Route::get('/admin/buku-tamu', [App\Http\Controllers\Admin\BukuTamuController::class, 'index'])->name('admin.buku-tamu.index');

    // Layanan -> SKM
    Route::get('/admin/skm', [App\Http\Controllers\Admin\SkmController::class, 'index'])->name('admin.skm.index');

    // Monitoring
    Route::get('/admin/monitoring', [App\Http\Controllers\Admin\MonitoringController::class, 'index'])->name('admin.monitoring.index');
    Route::get('/admin/activity-logs', [App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('admin.activity-logs.index');

    // Settings
    Route::get('/admin/settings', [App\Http\Controllers\Admin\SystemSettingsController::class, 'index'])->name('admin.settings.index');
    Route::post('/admin/settings/general', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateGeneral'])->name('admin.settings.update-general');
    Route::post('/admin/settings/portal', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updatePortal'])->name('admin.settings.update-portal');
    Route::post('/admin/settings/services', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateServices'])->name('admin.settings.update-services');
    Route::post('/admin/settings/notifications', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateNotifications'])->name('admin.settings.update-notifications');
    Route::post('/admin/settings/security', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateSecurity'])->name('admin.settings.update-security');
    Route::post('/admin/settings/maintenance', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateMaintenance'])->name('admin.settings.update-maintenance');
    Route::post('/admin/settings/integration', [App\Http\Controllers\Admin\SystemSettingsController::class, 'updateIntegration'])->name('admin.settings.update-integration');
});

Route::middleware(['auth', 'role:Pimpinan'])->group(function () {
    Route::get('/pimpinan/area', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'dashboard'])->name('pimpinan.dashboard');
    Route::get('/pimpinan/monitoring-layanan', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'monitoringLayanan'])->name('pimpinan.monitoring-layanan');
    Route::get('/pimpinan/permohonan', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'permohonan'])->name('pimpinan.permohonan');
    Route::get('/pimpinan/permohonan/{id}', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'detailPermohonan'])->name('pimpinan.permohonan.detail');
    Route::get('/pimpinan/permohonan/{id}/api', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'apiDetailPermohonan'])->name('pimpinan.permohonan.api-detail');
    Route::get('/pimpinan/permohonan/{id}/lampiran/{lampiranId}', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'lihatLampiran'])->name('pimpinan.permohonan.lampiran');
    Route::get('/pimpinan/laporan', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'laporan'])->name('pimpinan.laporan');
    Route::get('/pimpinan/export/excel', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'exportExcel'])->name('pimpinan.export.excel');
    Route::get('/pimpinan/export/pdf', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'exportPdf'])->name('pimpinan.export.pdf');
    Route::get('/pimpinan/aktivitas', [App\Http\Controllers\Pimpinan\PimpinanController::class, 'aktivitas'])->name('pimpinan.aktivitas');
});
