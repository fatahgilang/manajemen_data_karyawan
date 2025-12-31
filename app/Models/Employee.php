<?php

namespace App\Models;

use App\Models\Department;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\Position;
use App\Models\Applicant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Crypt;

class Employee extends Model
{
    use SoftDeletes;

    protected $table = 'employees';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'password_plaintext_encrypted',
        'password_last_reset_at',
        'phone_number',
        'department_id',
        'position_id',
        'join_date',
        'api_token',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'join_date' => 'date',
        'contract_end_date' => 'date',
        'resign_date' => 'date',
        'documents' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'password' => 'hashed',
        'password_last_reset_at' => 'datetime',
    ];

    // Normalization setter for phone_number
    protected function phoneNumber(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                $digits = preg_replace('/\D+/', '', (string) $value);
                if ($digits === '') {
                    return null;
                }
                if (str_starts_with($digits, '0')) {
                    $digits = '62' . substr($digits, 1);
                } elseif (!str_starts_with($digits, '62') && str_starts_with($digits, '8')) {
                    $digits = '62' . $digits;
                }
                return $digits;
            }
        );
    }

    // Relationships
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id', 'id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'employee_id', 'id');
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'employee_id', 'id');
    }

    public function applicant(): HasOne
    {
        return $this->hasOne(Applicant::class, 'employee_id', 'id');
    }

    // Accessors
    public function getFullInfoAttribute(): string
    {
        return "{$this->id} - {$this->name}";
    }

    public function getPlainPasswordAttribute(): ?string
    {
        if (!$this->password_plaintext_encrypted) {
            return null;
        }
        try {
            return Crypt::decryptString($this->password_plaintext_encrypted);
        } catch (\Throwable $e) {
            return null;
        }
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}