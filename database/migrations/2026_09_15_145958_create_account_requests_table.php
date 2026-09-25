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
        Schema::create('account_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_code', 50)->unique();
            $table->string('nama_lengkap', 100);
            $table->string('nik', 30);
            $table->string('nip', 30)->nullable();
            $table->string('email', 100);
            $table->string('nomor_whatsapp', 20);
            $table->string('jabatan', 100)->nullable();
            $table->string('unit_bagian', 100)->nullable();
            $table->enum('requested_role', ['petugas', 'pimpinan']);
            $table->text('alasan');
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
            
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            
            $table->string('activation_token', 64)->nullable()->unique();
            $table->timestamp('activation_expires_at')->nullable();
            
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_requests');
    }
};
