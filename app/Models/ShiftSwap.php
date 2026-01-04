<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftSwap extends Model
{
    protected $fillable = [
        'requester_employee_id',
        'target_employee_id',
        'date',
        'original_shift_id',
        'new_shift_id',
        'status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'requester_employee_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'target_employee_id');
    }

    public function originalShift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'original_shift_id');
    }

    public function newShift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'new_shift_id');
    }
}

