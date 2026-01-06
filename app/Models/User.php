<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Allow access to Filament panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return true; // Customize with role/permission checks as needed
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Ensure returned auth password is a valid bcrypt hash.
     * If a legacy/plaintext value is detected, rehash and persist it.
     */
    public function getAuthPassword()
    {
        $pass = (string) ($this->attributes['password'] ?? '');
        if ($pass !== '' && !str_starts_with($pass, '$2y$')) {
            $this->password = $pass; // triggers 'hashed' cast
            $this->save();
            $pass = (string) ($this->attributes['password'] ?? $pass);
        }
        return $pass;
    }
}
