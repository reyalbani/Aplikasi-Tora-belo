<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('konsultasi', function (Blueprint $table) {
            $table->id('id_konsultasi');
            $table->unsignedBigInteger('id_masyarakat');
            $table->unsignedBigInteger('id_petugas')->nullable();
            $table->text('pertanyaan');
            $table->text('tanggapan')->nullable();
            $table->dateTime('tanggal');
            $table->string('status', 30)->nullable();
            $table->timestamps();
            
            $table->foreign('id_masyarakat')->references('id_masyarakat')->on('masyarakat')->onDelete('cascade');
            $table->foreign('id_petugas')->references('id_petugas')->on('petugas')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('konsultasi');
    }
};