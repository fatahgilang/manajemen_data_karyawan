<?php

namespace App\Filament\Admin\Resources\EmployeeResource\RelationManagers;

use App\Models\Attendance;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\ImageColumn;
use Illuminate\Support\Facades\Storage; // tambah import

class AttendancesRelationManager extends RelationManager
{
    protected static string $relationship = 'attendances';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('date')
                    ->required(),
                Forms\Components\TimePicker::make('clock_in'),
                Forms\Components\TimePicker::make('clock_out'),
                Forms\Components\TextInput::make('latitude'),
                Forms\Components\TextInput::make('longitude'),
                Forms\Components\Select::make('status')
                    ->options([
                        'Hadir' => 'Hadir',
                        'Izin' => 'Izin',
                        'Sakit' => 'Sakit',
                        'Alpha' => 'Alpha',
                    ])
                    ->default('Hadir')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date')
                    ->label('Tanggal')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('clock_in')
                    ->label('Jam Masuk')
                    ->time()
                    ->sortable(),
                Tables\Columns\TextColumn::make('clock_out')
                    ->label('Jam Pulang')
                    ->time()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge(),
                // Foto pada relasi
                ImageColumn::make('check_in_photo_path')
                    ->label('Foto Masuk')
                    ->disk('public')
                    ->size(36)
                    ->circular()
                    ->toggleable(),
                ImageColumn::make('check_out_photo_path')
                    ->label('Foto Keluar')
                    ->disk('public')
                    ->size(36)
                    ->circular()
                    ->toggleable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}