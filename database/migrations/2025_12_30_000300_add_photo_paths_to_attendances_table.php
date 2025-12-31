<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'check_in_photo_path')) {
                $table->string('check_in_photo_path')->nullable()->after('accuracy');
            }
            if (!Schema::hasColumn('attendances', 'check_out_photo_path')) {
                $table->string('check_out_photo_path')->nullable()->after('check_in_photo_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (Schema::hasColumn('attendances', 'check_out_photo_path')) {
                $table->dropColumn('check_out_photo_path');
            }
            if (Schema::hasColumn('attendances', 'check_in_photo_path')) {
                $table->dropColumn('check_in_photo_path');
            }
        });
    }
};