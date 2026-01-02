<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Support\Facades\Crypt;

class Applicant extends Model
{
    protected $fillable = [
        'job_posting_id',
        'full_name',
        'email',
        'phone_number',
        'resume_path',
        'photo_path',
        'address',
        'skills',
        'education',
        'status',
        'employee_id',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    protected static function booted()
    {
        static::updated(function ($applicant) {
            try {
                if ($applicant->wasChanged('status') && $applicant->status === 'Hired' && !$applicant->employee_id) {
                    $plainPassword = Str::random(10);

                    // Check if employee with this email already exists
                    $existingEmployee = Employee::where('email', $applicant->email)->first();
                    if ($existingEmployee) {
                        $applicant->employee_id = $existingEmployee->id;
                        $applicant->saveQuietly();
                        return;
                    }

                    // Ensure department & position exist; create defaults if missing
                    $departmentId = Department::query()->value('id');
                    if (!$departmentId) {
                        $departmentId = Department::query()->create(['name' => 'General'])->id;
                    }
                    $positionId = Position::query()->value('id');
                    if (!$positionId) {
                        $positionId = Position::query()->create(['title' => 'Staff', 'base_salary' => 0])->id;
                    }

                    // Generate unique Employee primary key (string id)
                    do {
                        $empId = 'EMP-' . now()->format('Ymd') . '-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
                    } while (Employee::where('id', $empId)->exists());

                    $employee = Employee::create([
                        'id' => $empId,
                        'name' => $applicant->full_name,
                        'email' => $applicant->email,
                        'department_id' => $departmentId,
                        'position_id' => $positionId,
                        'join_date' => now()->toDateString(),
                        'phone_number' => $applicant->phone_number,
                        'password' => $plainPassword,
                        'password_plaintext_encrypted' => Crypt::encryptString($plainPassword),
                    ]);

                    $applicant->employee_id = $employee->id;
                    $applicant->saveQuietly();

                    // TODO: kirim password awal secara aman ke karyawan/admin
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Error creating employee for applicant: ' . $e->getMessage());
                \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
                throw $e;
            }
        });
    }

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id', 'id');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        $pathRaw = $this->photo_path;
        $path = is_string($pathRaw) ? trim($pathRaw) : '';
        // Treat placeholder values as empty
        $invalids = ['-', '—', 'null', 'undefined'];
        if (in_array(strtolower($path), $invalids, true)) {
            $path = '';
        }

        if ($path !== '') {
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                return $path;
            }
            return '/storage/' . ltrim($path, '/');
        }

        $name = trim($this->full_name ?? 'User');
        if ($name === '') {
            $name = 'User';
        }
        $encoded = rawurlencode($name);
        return "https://ui-avatars.com/api/?name={$encoded}&background=0f172a&color=fff&size=128";
    }

    public function getWhatsappLinkAttribute(): ?string
    {
        $raw = $this->phone_number;
        if (!$raw) return null;
        $digits = preg_replace('/\D+/', '', $raw);
        if ($digits === '') return null;
        if (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        } elseif (!str_starts_with($digits, '62')) {
            // Jika tidak mulai dengan 62 dan tidak 0, asumsikan nomor lokal Indonesia yang dimulai 8
            if (str_starts_with($digits, '8')) {
                $digits = '62' . $digits;
            }
        }
        $text = 'Halo ' . ($this->full_name ?? '') . ', terkait lamaran Anda.';
        return 'https://wa.me/' . $digits . '?text=' . rawurlencode($text);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }
}
