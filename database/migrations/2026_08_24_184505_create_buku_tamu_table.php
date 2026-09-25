<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('buku_tamu', function (Blueprint $table) {
            $table->id('id_buku_tamu');
            $table->unsignedBigInteger('id_masyarakat')->nullable();
            $table->string('nama', 100);
            $table->string('instansi', 100)->nullable();
            $table->text('keperluan');
            $table->dateTime('tanggal');
            $table->foreign('id_masyarakat')->references('id_masyarakat')->on('masyarakat')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('buku_tamu');
    }
};