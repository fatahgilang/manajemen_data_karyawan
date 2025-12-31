<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\EmployeeResource\Pages;
use App\Filament\Admin\Resources\EmployeeResource\RelationManagers;
use App\Models\Employee;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ForceDeleteBulkAction;
use Filament\Tables\Actions\RestoreBulkAction;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Notifications\Notification;
use Illuminate\Support\Str;
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Illuminate\Support\Facades\Crypt;

class EmployeeResource extends Resource
{
    protected static ?string $model = Employee::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
protected static ?string $modelLabel = 'Karyawan';
protected static ?string $pluralModelLabel = 'Karyawan';
protected static ?string $navigationLabel = 'Karyawan';
protected static ?string $navigationGroup = 'Kepegawaian';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->required()
                    ->maxLength(255)
                    ->label('ID Karyawan'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama'),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->label('Email'),
                Forms\Components\TextInput::make('phone_number')
                    ->tel()
                    ->placeholder('contoh: 081234567890')
                    ->maxLength(20)
                    ->helperText('Gunakan format Indonesia: 08xxxx, +62, atau 62. Disimpan sebagai 62xxxx.')
                    ->dehydrateStateUsing(function ($state) {
                        $value = (string) $state;
                        $digits = preg_replace('/\D+/', '', $value);
                        if ($digits === '') {
                            return null;
                        }
                        if (str_starts_with($digits, '0')) {
                            $digits = '62' . substr($digits, 1);
                        } elseif (str_starts_with($digits, '62')) {
                            // keep
                        } elseif (str_starts_with($digits, '8')) {
                            $digits = '62' . $digits;
                        }
                        return $digits;
                    })
                    ->nullable()
                    ->label('Nomor HP'),
                Forms\Components\Select::make('department_id')
                    ->relationship('department', 'name')
                    ->required()
                    ->label('Departemen'),
                Forms\Components\Select::make('position_id')
                    ->relationship('position', 'title')
                    ->required()
                    ->label('Jabatan'),
                Forms\Components\DatePicker::make('join_date')
                    ->required()
                    ->label('Tanggal Masuk'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID Karyawan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone_number')
                    ->label('Nomor HP')
                    ->toggleable()
                    ->limit(20),
                Tables\Columns\TextColumn::make('department.name')
                    ->label('Departemen')
                    ->searchable(),
                Tables\Columns\TextColumn::make('position.title')
                    ->label('Jabatan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('join_date')
                    ->label('Tanggal Masuk')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('resetPassword')
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
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            TextEntry::make('id')->label('ID Karyawan'),
            TextEntry::make('name')->label('Nama'),
            TextEntry::make('email')->label('Email'),
            TextEntry::make('phone_number')->label('Nomor HP'),
            TextEntry::make('department.name')->label('Departemen'),
            TextEntry::make('position.title')->label('Jabatan'),
            TextEntry::make('join_date')->label('Tanggal Masuk'),
            TextEntry::make('password')
                ->label('Password (hashed)')
                ->visible(fn($record) => !empty($record->password))
                ->formatStateUsing(fn($state) => is_string($state) ? substr($state, 0, 12) . '…' : ''),
            TextEntry::make('plain_password')
                ->label('Password (plaintext)')
                ->visible(fn($record) => !empty($record->password_plaintext_encrypted))
                ->copyable(),
            TextEntry::make('password_last_reset_at')
                ->label('Terakhir direset')
                ->dateTime()
                ->visible(fn($record) => !empty($record->password_last_reset_at)),
        ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\AttendancesRelationManager::make(),
            RelationManagers\PayrollsRelationManager::make(),
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmployees::route('/'),
            'create' => Pages\CreateEmployee::route('/create'),
            'view' => Pages\ViewEmployee::route('/{record}'),
            'edit' => Pages\EditEmployee::route('/{record}/edit'),
        ];
    }
}
