<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('shifts')) {
            Schema::create('shifts', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->time('start_time');
                $table->time('end_time');
                $table->boolean('is_night')->default(false);
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('shift_schedules')) {
            Schema::create('shift_schedules', function (Blueprint $table) {
                $table->id();
                $table->string('employee_id');
                $table->foreignId('shift_id')->constrained('shifts')->cascadeOnDelete();
                $table->date('date');
                $table->enum('status', ['assigned', 'swapped', 'off'])->default('assigned');
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->unique(['employee_id', 'date']);
                $table->foreign('employee_id')->references('id')->on('employees')->cascadeOnDelete();
            });
        }

        if (!Schema::hasTable('shift_swaps')) {
            Schema::create('shift_swaps', function (Blueprint $table) {
                $table->id();
                $table->string('requester_employee_id');
                $table->string('target_employee_id');
                $table->date('date');
                $table->foreignId('original_shift_id')->constrained('shifts')->cascadeOnDelete();
                $table->foreignId('new_shift_id')->nullable()->constrained('shifts')->nullOnDelete();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('approved_at')->nullable();
                $table->timestamps();
                $table->foreign('requester_employee_id')->references('id')->on('employees')->cascadeOnDelete();
                $table->foreign('target_employee_id')->references('id')->on('employees')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('shift_swaps');
        Schema::dropIfExists('shift_schedules');
        Schema::dropIfExists('shifts');
    }
};
