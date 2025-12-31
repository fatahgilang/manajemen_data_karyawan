<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Make resume_path nullable and expand length to 1000 for flexibility
        DB::statement('ALTER TABLE applicants MODIFY resume_path VARCHAR(1000) NULL');
    }

    public function down(): void
    {
        // Revert to NOT NULL with default length 255
        DB::statement('ALTER TABLE applicants MODIFY resume_path VARCHAR(255) NOT NULL');
    }
};