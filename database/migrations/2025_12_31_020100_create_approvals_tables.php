<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Bersihkan jika ada sisa dari migrasi gagal
        Schema::dropIfExists('approval_steps');
        Schema::dropIfExists('approval_requests');
        Schema::dropIfExists('department_approval_rules');

        Schema::create('department_approval_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['leave', 'overtime', 'reimburse']);
            $table->json('steps_json'); // array of approver steps (role/employee)
            $table->timestamps();
            $table->unique(['department_id', 'type']);
        });

        Schema::create('approval_requests', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['leave', 'overtime', 'reimburse']);
            // employees.id adalah string (NIK)
            $table->string('requester_employee_id');
            $table->foreign('requester_employee_id')->references('id')->on('employees')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->json('payload')->nullable(); // detail pengajuan
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['type', 'status']);
        });

        Schema::create('approval_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_request_id')->constrained('approval_requests')->cascadeOnDelete();
            $table->unsignedInteger('step_order');
            $table->enum('approver_type', ['role', 'employee']);
            $table->string('approver_role')->nullable(); // mis: manager, hr, finance
            // employees.id adalah string (NIK)
            $table->string('approver_employee_id')->nullable();
            $table->foreign('approver_employee_id')->references('id')->on('employees')->nullOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('decision_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('decision_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['approval_request_id', 'step_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_steps');
        Schema::dropIfExists('approval_requests');
        Schema::dropIfExists('department_approval_rules');
    }
};