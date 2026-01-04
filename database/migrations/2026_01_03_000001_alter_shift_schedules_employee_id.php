<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('shift_schedules')) {
            Schema::table('shift_schedules', function (Blueprint $table) {
                $table->string('employee_id')->change();
            });
        }
        if (Schema::hasTable('shift_swaps')) {
            Schema::table('shift_swaps', function (Blueprint $table) {
                $table->string('requester_employee_id')->change();
                $table->string('target_employee_id')->change();
            });
        }
    }

    public function down(): void
    {
        // No-op: reverting to previous type may fail if unknown; keep as string.
    }
};

