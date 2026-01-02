<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrDocumentVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'hr_document_id',
        'version_number',
        'file_path',
        'notes',
        'created_by',
    ];

    public function document()
    {
        return $this->belongsTo(HrDocument::class, 'hr_document_id');
    }
}