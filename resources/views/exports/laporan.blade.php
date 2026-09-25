<!DOCTYPE html>
<html>
<head>
    <title>Laporan Rekapitulasi Pelayanan</title>
    <style>
        body { font-family: sans-serif; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header h2 { margin: 5px 0; font-size: 16px; font-weight: normal; }
    </style>
</head>
<body>
    <div class="header">
        <h1>TORA BELO KPU KOTA PALU</h1>
        <h2>LAPORAN REKAPITULASI PELAYANAN</h2>
        <p>
            Periode: 
            @if($period === 'custom')
                {{ \Carbon\Carbon::parse($start)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($end)->format('d/m/Y') }}
            @else
                {{ ucfirst($period) }}
            @endif
        </p>
        <p>Tanggal Cetak: {{ \Carbon\Carbon::now('Asia/Makassar')->format('d M Y H:i:s') }} WITA</p>
    </div>

    <h3>1. Rekapitulasi Berdasarkan Layanan</h3>
    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>Nama Layanan</th>
                <th class="text-center">Baru</th>
                <th class="text-center">Diproses</th>
                <th class="text-center">Tertunda</th>
                <th class="text-center">Selesai</th>
                <th class="text-center">Ditolak</th>
                <th class="text-center font-bold">Total</th>
            </tr>
        </thead>
        <tbody>
            @php
                $tBaru = 0; $tDiproses = 0; $tTertunda = 0; $tSelesai = 0; $tDitolak = 0; $tTotal = 0;
            @endphp
            @foreach($rekapLayanan as $index => $row)
            @php
                $tBaru += $row['baru'];
                $tDiproses += $row['diproses'];
                $tTertunda += $row['tertunda'];
                $tSelesai += $row['selesai'];
                $tDitolak += $row['ditolak'];
                $tTotal += $row['total'];
            @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $row['layanan'] }}</td>
                <td class="text-center">{{ $row['baru'] }}</td>
                <td class="text-center">{{ $row['diproses'] }}</td>
                <td class="text-center">{{ $row['tertunda'] }}</td>
                <td class="text-center">{{ $row['selesai'] }}</td>
                <td class="text-center">{{ $row['ditolak'] }}</td>
                <td class="text-center font-bold">{{ $row['total'] }}</td>
            </tr>
            @endforeach
            @if(count($rekapLayanan) > 0)
            <tr>
                <td colspan="2" class="text-right font-bold" style="text-align: right; padding-right: 15px;">TOTAL KESELURUHAN</td>
                <td class="text-center font-bold">{{ $tBaru }}</td>
                <td class="text-center font-bold">{{ $tDiproses }}</td>
                <td class="text-center font-bold">{{ $tTertunda }}</td>
                <td class="text-center font-bold">{{ $tSelesai }}</td>
                <td class="text-center font-bold">{{ $tDitolak }}</td>
                <td class="text-center font-bold" style="font-size: 1.1em;">{{ $tTotal }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    <h3>2. Rincian Permohonan</h3>
    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>Kode Tiket</th>
                <th>Layanan</th>
                <th>Pemohon</th>
                <th>Tanggal Masuk</th>
                <th>Status</th>
                <th>Terakhir Diperbarui</th>
            </tr>
        </thead>
        <tbody>
            @forelse($permohonan as $index => $p)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $p->kode_tiket }}</td>
                <td>{{ $p->layanan->nama_layanan ?? '-' }}</td>
                <td>{{ $p->masyarakat->nama_lengkap ?? '-' }}</td>
                <td>{{ $p->created_at->format('d/m/Y H:i') }}</td>
                <td>{{ $p->status }}</td>
                <td>{{ $p->updated_at->format('d/m/Y H:i') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center">Belum ada data permohonan.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top: 50px; font-size: 12px; color: #555;">
        <p>Dokumen dihasilkan oleh TORA BELO KPU Kota Palu secara otomatis.</p>
    </div>
</body>
</html>
