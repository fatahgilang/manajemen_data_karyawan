<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'base_salary',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class, 'position_id', 'id');
    }
}
