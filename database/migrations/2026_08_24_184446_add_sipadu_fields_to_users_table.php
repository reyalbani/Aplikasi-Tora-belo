<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('id_role')->nullable()->after('id');
            $table->string('name', 100)->nullable()->after('id_role');
            $table->string('email', 100)->nullable()->after('name');
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->string('password', 255)->nullable()->after('email_verified_at');
            $table->string('no_hp', 20)->nullable()->after('password');
            $table->string('status', 20)->nullable()->after('no_hp');
            $table->rememberToken()->after('status');
            
            $table->foreign('id_role')->references('id_role')->on('roles')->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_role']);
            $table->dropColumn(['id_role', 'name', 'email', 'email_verified_at', 'password', 'no_hp', 'status', 'remember_token']);
        });
    }
};