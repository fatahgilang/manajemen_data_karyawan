<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentApprovalRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'type',
        'steps_json',
    ];

    protected $casts = [
        'steps_json' => 'array',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}