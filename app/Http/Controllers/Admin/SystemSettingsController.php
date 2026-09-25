<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Services\SystemSettingService;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\DB;
use Exception;

class SystemSettingsController extends Controller
{
    public function index()
    {
        Gate::authorize('settings.view');

        $settings = SystemSettingService::getAllSettings();

        // Mask sensitive settings for frontend
        if (isset($settings['integration.smtp_password'])) {
            $settings['integration.smtp_password'] = '**********';
        }

        return Inertia::render('admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function updateGeneral(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'app.name' => 'required|string|max:255',
            'app.institution' => 'required|string|max:255',
            'app.description' => 'nullable|string',
            'app.email' => 'nullable|email',
            'app.phone' => 'nullable|string',
            'app.address' => 'nullable|string',
            'app.website' => 'nullable|url',
            'app.logo' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:2048',
            'app.favicon' => 'nullable|file|mimes:png,ico|max:1024',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = 'string';
            if (in_array($key, ['app.logo', 'app.favicon'])) {
                if ($request->hasFile($key)) {
                    $type = 'file';
                } else {
                    continue; // Skip if no new file is uploaded
                }
            }
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => true
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'general');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan umum sistem.', null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan umum berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan umum.']);
        }
    }

    public function updatePortal(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'portal.title' => 'required|string|max:255',
            'portal.subtitle' => 'nullable|string|max:255',
            'portal.welcome_text' => 'nullable|string',
            'portal.description' => 'nullable|string',
            'portal.email' => 'nullable|email',
            'portal.phone' => 'nullable|string',
            'portal.address' => 'nullable|string',
            'portal.website' => 'nullable|url',
            'portal.facebook' => 'nullable|url',
            'portal.instagram' => 'nullable|url',
            'portal.youtube' => 'nullable|url',
            'portal.x' => 'nullable|url',
            'portal.footer_text' => 'nullable|string',
            'portal.hero_active' => 'boolean',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : 'string';
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => true
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'portal');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan portal publik.', null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan portal publik berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan portal.']);
        }
    }

    public function updateServices(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'service.is_open' => 'boolean',
            'service.closed_message' => 'nullable|string',
            'service.start_time' => 'required|string|date_format:H:i',
            'service.end_time' => 'required|string|date_format:H:i',
            'service.days' => 'array',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : (is_array($value) ? 'json' : 'string');
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => true
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'services');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan layanan global.', null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan layanan berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan layanan.']);
        }
    }

    public function updateNotifications(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'notification.new_request' => 'boolean',
            'notification.status_change' => 'boolean',
            'notification.new_skm' => 'boolean',
            'notification.new_guest' => 'boolean',
            'notification.system_alerts' => 'boolean',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => 'boolean',
                'is_public' => false
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'notifications');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan notifikasi sistem.', null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan notifikasi berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan notifikasi.']);
        }
    }

    public function updateSecurity(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'security.session_timeout' => 'required|integer|min:1|max:1440',
            'security.max_login_attempts' => 'required|integer|min:1|max:20',
            'security.lockout_duration' => 'required|integer|min:1',
            'security.password_min_length' => 'required|integer|min:8',
            'security.require_uppercase' => 'boolean',
            'security.require_number' => 'boolean',
            'security.require_special' => 'boolean',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : 'integer';
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => false
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'security');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan keamanan.', null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan keamanan berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan keamanan.']);
        }
    }

    public function updateMaintenance(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'maintenance.is_active' => 'boolean',
            'maintenance.message' => 'nullable|string',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : 'string';
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => true // Needs to be public so the portal knows to show maintenance page
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'maintenance');
            
            $status = $validated['maintenance.is_active'] ? 'ON' : 'OFF';
            ActivityLogger::log('Update Settings', 'Sistem', "Mengubah status Maintenance Mode menjadi $status.", null, null, [
                'updated_fields' => array_keys($settingsToSave)
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan pemeliharaan berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan pemeliharaan.']);
        }
    }

    public function updateIntegration(Request $request)
    {
        Gate::authorize('settings.manage');

        $validated = $request->validate([
            'integration.smtp_host' => 'nullable|string|max:255',
            'integration.smtp_port' => 'nullable|integer',
            'integration.smtp_username' => 'nullable|string|max:255',
            'integration.smtp_password' => 'nullable|string',
            'integration.smtp_encryption' => 'nullable|string|in:tls,ssl,none',
            'integration.mail_from_address' => 'nullable|email',
            'integration.mail_from_name' => 'nullable|string|max:255',
        ]);

        $settingsToSave = [];
        foreach ($validated as $key => $value) {
            $type = is_integer($value) ? 'integer' : 'string';
            $settingsToSave[$key] = [
                'value' => $value,
                'type' => $type,
                'is_public' => false
            ];
        }

        try {
            DB::beginTransaction();
            SystemSettingService::setMany($settingsToSave, 'integration');
            
            ActivityLogger::log('Update Settings', 'Sistem', 'Memperbarui pengaturan integrasi/SMTP.', null, null, [
                'updated_fields' => array_keys($settingsToSave) // Password will be masked by ActivityLogger
            ]);
            
            DB::commit();
            return back()->with('success', 'Pengaturan integrasi berhasil disimpan.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pengaturan integrasi.']);
        }
    }
}
