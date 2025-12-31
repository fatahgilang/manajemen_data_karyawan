<?php

namespace App\Filament\Admin\Resources\EmployeeResource\Pages;

use App\Filament\Admin\Resources\EmployeeResource;
use App\Models\Employee;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class ViewEmployee extends ViewRecord
{
    protected static string $resource = EmployeeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\Action::make('resetPassword')
                ->label('Reset Password')
                ->requiresConfirmation()
                ->color('warning')
                ->icon('heroicon-o-key')
                ->action(function (Employee $record) {
                    $plain = Str::random(10);
                    $record->password = $plain; // hashed via casts
                    $record->password_plaintext_encrypted = Crypt::encryptString($plain);
                    $record->password_last_reset_at = now();
                    $record->save();

                    Notification::make()
                        ->title('Password karyawan direset')
                        ->body('Password baru: ' . $plain)
                        ->success()
                        ->send();
                }),
        ];
    }
}