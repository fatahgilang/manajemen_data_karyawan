<?php

namespace App\Models;

use App\Models\ShiftSchedule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'is_night',
        'description',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(ShiftSchedule::class);
    }
}

