<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('laporan', function (Blueprint $table) {
            $table->id('id_laporan');
            $table->unsignedBigInteger('id_admin');
            $table->string('jenis', 50);
            $table->string('periode', 30)->nullable();
            $table->dateTime('tanggal');
            $table->string('file', 255)->nullable();
            $table->foreign('id_admin')->references('id_admin')->on('admin')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('laporan');
    }
};