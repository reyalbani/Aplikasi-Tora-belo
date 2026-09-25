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
        Schema::table('audit_log', function (Blueprint $table) {
            if (!Schema::hasColumn('audit_log', 'role')) {
                $table->string('role')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'action')) {
                $table->string('action')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'module')) {
                $table->string('module')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'subject_type')) {
                $table->string('subject_type')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'subject_id')) {
                $table->unsignedBigInteger('subject_id')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'properties')) {
                $table->json('properties')->nullable();
            }
            if (!Schema::hasColumn('audit_log', 'user_agent')) {
                $table->text('user_agent')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audit_log', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'action',
                'module',
                'description',
                'subject_type',
                'subject_id',
                'properties',
                'user_agent'
            ]);
        });
    }
};
