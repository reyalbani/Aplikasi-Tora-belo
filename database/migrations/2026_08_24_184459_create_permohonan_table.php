<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('permohonan', function (Blueprint $table) {
            $table->id('id_permohonan');
            $table->unsignedBigInteger('id_masyarakat');
            $table->unsignedBigInteger('id_layanan');
            $table->unsignedBigInteger('id_petugas')->nullable();
            $table->string('kode_tiket', 30);
            $table->dateTime('tanggal_pengajuan');
            $table->text('isi_permohonan')->nullable();
            $table->string('status', 30);
            $table->text('hasil')->nullable();
            $table->dateTime('tanggal_selesai')->nullable();
            $table->timestamps();
            
            $table->foreign('id_masyarakat')->references('id_masyarakat')->on('masyarakat')->onDelete('cascade');
            $table->foreign('id_layanan')->references('id_layanan')->on('layanan')->onDelete('cascade');
            $table->foreign('id_petugas')->references('id_petugas')->on('petugas')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('permohonan');
    }
};