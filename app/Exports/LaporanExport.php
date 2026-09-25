<?php

namespace App\Exports;

use App\Models\Permohonan;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class LaporanExport implements FromView, ShouldAutoSize
{
    protected $permohonan;
    protected $rekapLayanan;
    protected $period;
    protected $start;
    protected $end;

    public function __construct($permohonan, $rekapLayanan, $period, $start, $end)
    {
        $this->permohonan = $permohonan;
        $this->rekapLayanan = $rekapLayanan;
        $this->period = $period;
        $this->start = $start;
        $this->end = $end;
    }

    public function view(): View
    {
        return view('exports.laporan', [
            'permohonan' => $this->permohonan,
            'rekapLayanan' => $this->rekapLayanan,
            'period' => $this->period,
            'start' => $this->start,
            'end' => $this->end,
        ]);
    }
}
