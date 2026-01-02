<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HrDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'category',
        'department_id',
        'employee_id',
        'effective_date',
        'expiry_date',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'effective_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function versions()
    {
        return $this->hasMany(HrDocumentVersion::class);
    }

    public function latestVersion()
    {
        return $this->hasOne(HrDocumentVersion::class)->latestOfMany('version_number');
    }
}