<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('status_permohonan', function (Blueprint $table) {
            $table->id('id_status');
            $table->unsignedBigInteger('id_permohonan');
            $table->unsignedBigInteger('id_petugas')->nullable();
            $table->string('status', 30);
            $table->text('keterangan')->nullable();
            $table->dateTime('waktu');
            
            $table->foreign('id_permohonan')->references('id_permohonan')->on('permohonan')->onDelete('cascade');
            $table->foreign('id_petugas')->references('id_petugas')->on('petugas')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::dropIfExists('status_permohonan');
    }
};