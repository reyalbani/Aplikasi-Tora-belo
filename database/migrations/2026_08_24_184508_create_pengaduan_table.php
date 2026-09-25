<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('pengaduan', function (Blueprint $table) {
            $table->id('id_pengaduan');
            $table->unsignedBigInteger('id_masyarakat');
            $table->unsignedBigInteger('id_petugas')->nullable();
            $table->string('kode_pengaduan', 30);
            $table->text('isi_pengaduan');
            $table->dateTime('tanggal');
            $table->string('status', 30);
            $table->text('tanggapan')->nullable();
            $table->dateTime('tanggal_selesai')->nullable();
            $table->timestamps();
            
            $table->foreign('id_masyarakat')->references('id_masyarakat')->on('masyarakat')->onDelete('cascade');
            $table->foreign('id_petugas')->references('id_petugas')->on('petugas')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('pengaduan');
    }
};