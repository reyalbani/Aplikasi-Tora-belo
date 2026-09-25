<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('pimpinan', function (Blueprint $table) {
            $table->id('id_pimpinan');
            $table->unsignedBigInteger('id_user');
            $table->string('jabatan', 100)->nullable();
            $table->timestamps();
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('pimpinan');
    }
};