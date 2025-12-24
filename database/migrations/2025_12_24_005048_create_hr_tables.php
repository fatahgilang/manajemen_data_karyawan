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
       Schema::create('departments', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });

    Schema::create('positions', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->decimal('base_salary', 15, 2);
        $table->timestamps();
    });

    Schema::create('employees', function (Blueprint $table) {
        $table->string('id')->primary(); // NIK
        $table->string('name');
        $table->string('email')->unique();
        $table->foreignId('department_id')->constrained();
        $table->foreignId('position_id')->constrained();
        $table->date('join_date');
        $table->timestamps();
        $table->softDeletes();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('departments');
    }
};