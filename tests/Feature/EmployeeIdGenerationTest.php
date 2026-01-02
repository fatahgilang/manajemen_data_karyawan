<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class EmployeeIdGenerationTest extends TestCase
{
    // use RefreshDatabase; // Be careful with this on a real dev env if it wipes data. The user environment seems to be local dev.
    // Given the instructions, I should probably not wipe the database unless I'm sure.
    // Instead of RefreshDatabase, I will just create data and clean up or use transactions.
    // But standard Laravel tests use RefreshDatabase which uses transactions.
    // Let's assume it's safe to use DatabaseTransactions if I want to avoid wiping.
    
    use \Illuminate\Foundation\Testing\DatabaseTransactions;

    public function test_employee_id_is_generated_automatically()
    {
        // Create dependencies
        $department = Department::create(['name' => 'IT Dept Test']);
        $position = Position::create(['title' => 'Developer Test', 'base_salary' => 5000000]);

        // Create Employee without ID
        $employee = Employee::create([
            'name' => 'Test Employee',
            'email' => 'test_emp_' . time() . '@example.com',
            'department_id' => $department->id,
            'position_id' => $position->id,
            'join_date' => now(),
        ]);

        // Assert ID is generated
        $this->assertNotEmpty($employee->id);
        
        // Assert Format EMP + YYMM + XXXX
        $yearMonth = date('ym');
        $this->assertStringStartsWith('EMP' . $yearMonth, $employee->id);
        $this->assertEquals(11, strlen($employee->id)); // EMP (3) + YYMM (4) + XXXX (4) = 11

        // Create another employee to test increment
        $employee2 = Employee::create([
            'name' => 'Test Employee 2',
            'email' => 'test_emp2_' . time() . '@example.com',
            'department_id' => $department->id,
            'position_id' => $position->id,
            'join_date' => now(),
        ]);

        $this->assertNotEmpty($employee2->id);
        $this->assertNotEquals($employee->id, $employee2->id);
        
        // Check if sequence incremented
        $seq1 = intval(substr($employee->id, -4));
        $seq2 = intval(substr($employee2->id, -4));
        
        $this->assertEquals($seq1 + 1, $seq2);
    }
}
