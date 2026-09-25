<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('persyaratan', function (Blueprint $table) {
            $table->id('id_persyaratan');
            $table->unsignedBigInteger('id_layanan');
            $table->string('nama_persyaratan', 150);
            $table->text('keterangan')->nullable();
            $table->boolean('wajib');
            $table->foreign('id_layanan')->references('id_layanan')->on('layanan')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('persyaratan');
    }
};