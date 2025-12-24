<?php

namespace App\Models;

use App\Models\Applicant;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function applicants()
    {
        return $this->hasMany(Applicant::class, 'job_posting_id', 'id');
    }
}
