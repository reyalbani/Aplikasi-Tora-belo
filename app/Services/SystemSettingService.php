<?php

namespace App\Services;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class SystemSettingService
{
    /**
     * Get a setting by key.
     */
    public static function get($key, $default = null)
    {
        $settings = self::getAllSettings();
        
        if (array_key_exists($key, $settings)) {
            return $settings[$key];
        }

        return $default;
    }

    /**
     * Set a single setting.
     */
    public static function set($key, $value, $type = 'string', $group = 'general', $isPublic = false)
    {
        $formattedValue = self::formatValueForStorage($value, $type);

        SystemSetting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $formattedValue,
                'type' => $type,
                'group' => $group,
                'is_public' => $isPublic,
            ]
        );

        self::clearCache();
    }

    /**
     * Set many settings at once. Data should be an array of settings.
     * Example: ['app.name' => 'My App', 'app.logo' => $file]
     */
    public static function setMany(array $settings, $group = 'general')
    {
        foreach ($settings as $key => $data) {
            $value = $data['value'] ?? null;
            $type = $data['type'] ?? 'string';
            $isPublic = $data['is_public'] ?? false;
            
            // File upload logic
            if ($type === 'file' && $value instanceof UploadedFile) {
                // Delete old file if exists
                $oldValue = self::get($key);
                if ($oldValue && Storage::disk('public')->exists($oldValue)) {
                    Storage::disk('public')->delete($oldValue);
                }
                
                $path = $value->store('settings', 'public');
                $value = $path;
                $type = 'string'; // Stored as string path
            }

            // Skip setting if value is exactly "**********" (Masked password)
            if ($type === 'string' && $value === '**********') {
                continue;
            }

            self::set($key, $value, $type, $group, $isPublic);
        }
    }

    /**
     * Format the value based on its type to store in db as text.
     */
    private static function formatValueForStorage($value, $type)
    {
        if ($value === null) {
            return null;
        }

        switch ($type) {
            case 'boolean':
                return $value ? 'true' : 'false';
            case 'json':
                return is_array($value) ? json_encode($value) : $value;
            default:
                return (string) $value;
        }
    }

    /**
     * Get all settings mapped as key => parsed_value.
     */
    public static function getAllSettings()
    {
        return Cache::rememberForever('system.settings', function () {
            $settings = SystemSetting::all();
            $mapped = [];
            foreach ($settings as $setting) {
                $mapped[$setting->key] = $setting->parsed_value;
            }
            return $mapped;
        });
    }

    /**
     * Clear the cache.
     */
    public static function clearCache()
    {
        Cache::forget('system.settings');
    }
}
