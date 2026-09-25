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
        Schema::table('buku_tamu', function (Blueprint $table) {
            $table->string('nomor_whatsapp', 50)->nullable()->after('nama');
            $table->string('email', 100)->nullable()->after('nomor_whatsapp');
            $table->unsignedBigInteger('id_layanan')->nullable()->after('id_buku_tamu');
            
            // Allow keperluan to be nullable instead of dropping it entirely, 
            // to avoid losing data and since requirement just says "JANGAN tambahkan field Keperluan"
            $table->text('keperluan')->nullable()->change();

            $table->foreign('id_layanan')->references('id_layanan')->on('layanan')->onDelete('set null');
        });

        Schema::table('skm_responden', function (Blueprint $table) {
            $table->unsignedBigInteger('id_permohonan')->nullable()->after('id');
            $table->string('email', 100)->nullable()->after('nama');
            $table->string('nomor_hp', 50)->nullable()->after('email');
            $table->time('jam_survei')->nullable()->after('tanggal');
            $table->string('domisili')->nullable()->after('jenis_kelamin');
            $table->string('usia')->nullable()->after('umur'); // using usia as required, maybe replacing umur
            
            $table->foreign('id_permohonan')->references('id_permohonan')->on('permohonan')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buku_tamu', function (Blueprint $table) {
            $table->dropForeign(['id_layanan']);
            $table->dropColumn(['nomor_whatsapp', 'email', 'id_layanan']);
            $table->text('keperluan')->nullable(false)->change();
        });

        Schema::table('skm_responden', function (Blueprint $table) {
            $table->dropForeign(['id_permohonan']);
            $table->dropColumn(['id_permohonan', 'email', 'nomor_hp', 'jam_survei', 'domisili', 'usia']);
        });
    }
};
