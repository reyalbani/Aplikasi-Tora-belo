<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        // Gate::authorize('monitoring.activity.view'); // Assuming gate authorization, commented out if not globally enforced

        $query = AuditLog::with('user:id,name,email');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('module', 'like', "%{$search}%")
                ->orWhere('action', 'like', "%{$search}%")
                ->orWhere('aktivitas', 'like', "%{$search}%");
            });
        }

        // Filter by Role
        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by Module
        if ($request->filled('module') && $request->module !== 'all') {
            $query->where('module', $request->module);
        }

        // Filter by Action
        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        // Filter by Date
        if ($request->filled('date') && $request->date !== 'all') {
            $dateFilter = $request->date;
            if ($dateFilter === 'today') {
                $query->whereDate('waktu', Carbon::today());
            } elseif ($dateFilter === '7days') {
                $query->where('waktu', '>=', Carbon::now()->subDays(7));
            } elseif ($dateFilter === '30days') {
                $query->where('waktu', '>=', Carbon::now()->subDays(30));
            }
        }

        // Pagination & Sorting
        $sortField = $request->input('sortField', 'waktu');
        $sortDirection = $request->input('sortDirection', 'desc');

        if (in_array($sortField, ['waktu', 'id_log'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->input('perPage', 20);
        $logs = $query->paginate($perPage)->withQueryString();

        // Mapping properties if they are a string (in some old databases)
        $logs->getCollection()->transform(function ($log) {
            $properties = $log->properties;
            if (is_string($properties)) {
                $properties = json_decode($properties, true);
            }
            $log->properties = $properties;
            return $log;
        });

        // Summary Statistics
        $totalAktivitas = AuditLog::count();
        $aktivitasHariIni = AuditLog::whereDate('waktu', Carbon::today())->count();
        
        // Pengguna Aktif Hari ini (distinct users who did something today)
        $penggunaAktif = AuditLog::whereDate('waktu', Carbon::today())
                                 ->whereNotNull('id_user')
                                 ->distinct('id_user')
                                 ->count('id_user');

        $aktivitasTerakhir = AuditLog::orderBy('waktu', 'desc')->value('waktu');
        
        $summary = [
            'total' => $totalAktivitas,
            'today' => $aktivitasHariIni,
            'active_users' => $penggunaAktif,
            'last_activity' => $aktivitasTerakhir ? Carbon::parse($aktivitasTerakhir)->diffForHumans() : 'Belum ada',
        ];

        return Inertia::render('admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'role', 'module', 'action', 'date', 'perPage']),
            'summary' => $summary,
        ]);
    }
}
