<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaduan_pelayanans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_tiket')->unique();
            $table->string('nama_lengkap');
            $table->string('email');
            $table->string('telepon');
            $table->enum('jenis', ['aduan', 'pertanyaan', 'saran', 'masukan']);
            $table->text('pesan');
            $table->string('status')->default('Menunggu Respon');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaduan_pelayanans');
    }
};
