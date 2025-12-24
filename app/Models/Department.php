<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;  

class Department extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    // Relationships
    public function employees()
    {
        return $this->hasMany(Employee::class, 'department_id', 'id');
    }

    public function getActiveEmployeesCountAttribute(): int
    {
        return $this->employees()->where('is_active', true)->count();
    }
}
