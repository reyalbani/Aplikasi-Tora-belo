<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('dokumen_permohonan', function (Blueprint $table) {
            $table->id('id_dokumen');
            $table->unsignedBigInteger('id_permohonan');
            $table->string('nama_file', 150);
            $table->string('path_file', 255);
            $table->string('jenis_dokumen', 100)->nullable();
            $table->integer('ukuran_file')->nullable();
            $table->dateTime('tanggal_upload')->nullable();
            $table->foreign('id_permohonan')->references('id_permohonan')->on('permohonan')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('dokumen_permohonan');
    }
};