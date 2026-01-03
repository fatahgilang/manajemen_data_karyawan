<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\ApplicantResource\Pages;
use App\Filament\Admin\Resources\ApplicantResource\RelationManagers;
use App\Models\Applicant;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Illuminate\Support\Facades\Storage;
use Filament\Tables\Actions\Action;

class ApplicantResource extends Resource
{
    protected static ?string $model = Applicant::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $modelLabel = 'Pelamar';
    protected static ?string $pluralModelLabel = 'Pelamar';
    protected static ?string $navigationLabel = 'Pelamar';
    protected static ?string $navigationGroup = 'Rekrutmen';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('job_posting_id')
                    ->relationship('jobPosting', 'title')
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('full_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('address')
                    ->label('Alamat')
                    ->maxLength(255)
                    ->columnSpan('full'),
                Forms\Components\TextInput::make('skills')
                    ->label('Keahlian')
                    ->maxLength(255)
                    ->columnSpan('full'),
                Forms\Components\TextInput::make('education')
                    ->label('Pendidikan')
                    ->maxLength(255)
                    ->columnSpan('full'),
                Forms\Components\FileUpload::make('photo_path')
                    ->label('Foto Pelamar')
                    ->image()
                    ->disk('public')
                    ->directory('applicant_photos')
                    ->visibility('public')
                    ->maxSize(5120)
                    ->columnSpan('full'),
                Forms\Components\TextInput::make('resume_path')
                    ->maxLength(255)
                    ->label('Resume Path (File Location)')
                    ->helperText('Opsional; terisi otomatis saat upload'),
                Forms\Components\Select::make('status')
                    ->options([
                        'Pending' => 'Menunggu',
                        'Interview' => 'Wawancara',
                        'Rejected' => 'Ditolak',
                        'Hired' => 'Diterima',
                    ])
                    ->default('Pending')
                    ->required(),
                Forms\Components\TextInput::make('phone_number')
                    ->label('Nomor HP')
                    ->maxLength(20)
                    ->helperText('Contoh: 081234567890 atau +62')
                    ->columnSpan('full'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('jobPosting.title')
                    ->label('Lowongan')
                    ->searchable(),
                ImageColumn::make('photo_path')
                    ->label('Foto')
                    ->disk('public')
                    ->size(48)
                    ->circular()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Nama Lengkap')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone_number')
                    ->label('Nomor HP')
                    ->toggleable()
                    ->limit(20),
                Tables\Columns\TextColumn::make('address')
                    ->label('Alamat')
                    ->toggleable()
                    ->limit(40),
                // Tables\Columns\TextColumn::make('skills')
                //     ->label('Keahlian')
                //     ->toggleable()
                //     ->limit(40),
                // Tables\Columns\TextColumn::make('education')
                //     ->label('Pendidikan')
                //     ->toggleable()
                //     ->limit(40),
                // Tables\Columns\TextColumn::make('resume_path')
                //     ->label('Resume')
                //     ->toggleable()
                //     ->limit(30),
                Tables\Columns\TextColumn::make('resume_download')
                    ->label('Download')
                    ->html()
                    ->state(function ($record) {
                        if (!$record) return '';
                        $path = $record->resume_path;
                        if (!$path) return '';
                        if (is_string($path) && (str_starts_with($path, 'http://') || str_starts_with($path, 'https://'))) {
                            $url = $path;
                        } else {
                            $url = '/storage/' . ltrim($path, '/');
                        }
                        return '<a href="'.e($url).'" target="_blank" class="text-primary-600 underline">Download</a>';
                    })
                    ->visible(fn ($record) => $record && filled($record->resume_path)),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Hired' => 'success',
                        'Interview' => 'info',
                        'Rejected' => 'danger',
                        'Pending' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('employee_id')
                    ->label('ID Karyawan')
                    ->toggleable()
                    ->visible(fn ($record) => $record && filled($record->employee_id)),
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
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('whatsapp')
                    ->label('Hubungi WhatsApp')
                    ->icon('heroicon-o-phone')
                    ->color('success')
                    ->url(fn ($record) => $record?->whatsapp_link ?? '#')
                    ->visible(fn ($record) => $record && filled($record->phone_number))
                    ->openUrlInNewTab(),
                Tables\Actions\Action::make('accept')
                    ->label('Terima')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record && $record->status !== 'Hired')
                    ->action(fn ($record) => $record->update(['status' => 'Hired'])),
                Tables\Actions\Action::make('viewEmployee')
                    ->label('Lihat Karyawan')
                    ->icon('heroicon-o-user')
                    ->color('primary')
                    ->visible(fn ($record) => $record && filled($record->employee_id))
                    ->url(fn ($record) => '/admin/employees/' . $record->employee_id . '/edit')
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListApplicants::route('/'),
            'create' => Pages\CreateApplicant::route('/create'),
            'edit' => Pages\EditApplicant::route('/{record}/edit'),
        ];
    }
}
