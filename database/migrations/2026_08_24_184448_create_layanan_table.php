<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('layanan', function (Blueprint $table) {
            $table->id('id_layanan');
            $table->string('nama_layanan', 150);
            $table->text('deskripsi')->nullable();
            $table->string('kategori', 50)->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('status', 20);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('layanan');
    }
};