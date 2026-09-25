<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->date('visit_date');
            $table->timestamps();
            
            // So we don't insert multiple times per day for the same user
            $table->unique(['ip_address', 'user_agent', 'visit_date'], 'visitor_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
