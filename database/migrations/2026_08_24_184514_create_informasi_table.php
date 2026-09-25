<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('informasi', function (Blueprint $table) {
            $table->id('id_informasi');
            $table->unsignedBigInteger('id_admin');
            $table->string('judul', 150);
            $table->text('isi');
            $table->string('gambar', 255)->nullable();
            $table->dateTime('tanggal');
            $table->string('status', 20);
            $table->timestamps();
            $table->foreign('id_admin')->references('id_admin')->on('admin')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('informasi');
    }
};