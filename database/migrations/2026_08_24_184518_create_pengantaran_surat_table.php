<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('pengantaran_surat', function (Blueprint $table) {
            $table->id('id_pengantaran');
            $table->unsignedBigInteger('id_permohonan');
            $table->unsignedBigInteger('id_petugas')->nullable();
            $table->string('nomor_surat', 100)->nullable();
            $table->string('tujuan', 255)->nullable();
            $table->text('alamat_tujuan')->nullable();
            $table->dateTime('tanggal_pengantaran')->nullable();
            $table->string('status', 30)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->foreign('id_permohonan')->references('id_permohonan')->on('permohonan')->onDelete('cascade');
            $table->foreign('id_petugas')->references('id_petugas')->on('petugas')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('pengantaran_surat');
    }
};