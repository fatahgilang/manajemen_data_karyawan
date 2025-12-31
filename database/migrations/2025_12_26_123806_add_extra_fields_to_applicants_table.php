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
        Schema::table('applicants', function (Blueprint $table) {
            $table->string('photo_path')->nullable()->after('resume_path');
            $table->string('address', 500)->nullable()->after('photo_path');
            $table->text('skills')->nullable()->after('address');
            $table->string('education', 255)->nullable()->after('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn(['photo_path', 'address', 'skills', 'education']);
        });
    }
};
