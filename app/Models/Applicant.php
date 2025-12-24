<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    protected $fillable = [
        'job_posting_id',
        'full_name',
        'email',
        'resume_path',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id', 'id');
    }
}
