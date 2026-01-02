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
        // Bersihkan tabel jika tertinggal dari migrasi gagal sebelumnya
        Schema::dropIfExists('hr_document_versions');
        Schema::dropIfExists('hr_documents');

        Schema::create('hr_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', ['contract', 'warning', 'policy']);
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            // employees.id adalah string (NIK), gunakan string FK
            $table->string('employee_id')->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->nullOnDelete();
            $table->date('effective_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('hr_document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hr_document_id')->constrained('hr_documents')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('file_path');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['hr_document_id', 'version_number']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hr_document_versions');
        Schema::dropIfExists('hr_documents');
    }
};