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
        Schema::create('skm_pertanyaan', function (Blueprint $table) {
            $table->id();
            $table->string('pertanyaan');
            $table->string('tipe')->default('rating'); // rating, text, dll
            $table->integer('urutan')->default(0);
            $table->string('status')->default('aktif');
            $table->timestamps();
        });

        Schema::create('skm_responden', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_masyarakat')->nullable();
            $table->string('nama')->nullable();
            $table->string('umur')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->string('pendidikan')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->text('saran')->nullable();
            $table->date('tanggal');
            $table->timestamps();

            // Asumsi tabel masyarakat menggunakan id_masyarakat sebagai PK
            // Jika ada tabel masyarakat:
            // $table->foreign('id_masyarakat')->references('id_masyarakat')->on('masyarakat')->onDelete('set null');
        });

        Schema::create('skm_jawaban', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('responden_id');
            $table->unsignedBigInteger('pertanyaan_id');
            $table->text('jawaban')->nullable();
            $table->integer('nilai')->nullable(); // 1-4 atau 1-5
            $table->timestamps();

            $table->foreign('responden_id')->references('id')->on('skm_responden')->onDelete('cascade');
            $table->foreign('pertanyaan_id')->references('id')->on('skm_pertanyaan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skm_jawaban');
        Schema::dropIfExists('skm_responden');
        Schema::dropIfExists('skm_pertanyaan');
    }
};
