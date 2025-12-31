<?php

namespace App\Filament\Admin\Resources\EmployeeResource\RelationManagers;

use App\Models\Payroll;
use Filament\Forms;
use Filament\Forms\Components\TextInput\Mask;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\RawJs;

class PayrollsRelationManager extends RelationManager
{
    protected static string $relationship = 'payrolls';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('pay_period_start')
                    ->required(),
                Forms\Components\DatePicker::make('pay_period_end')
                    ->required(),
                Forms\Components\TextInput::make('basic_salary')
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => is_numeric($state) ? (float) $state : (float) str_replace(',', '.', str_replace('.', '', preg_replace('/[^0-9,.-]/', '', (string) $state))))
                    ->required(),
                Forms\Components\TextInput::make('allowances')
                    ->default(0)
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => is_numeric($state) ? (float) $state : (float) str_replace(',', '.', str_replace('.', '', preg_replace('/[^0-9,.-]/', '', (string) $state))))
                    ->required(),
                Forms\Components\TextInput::make('deductions')
                    ->default(0)
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => is_numeric($state) ? (float) $state : (float) str_replace(',', '.', str_replace('.', '', preg_replace('/[^0-9,.-]/', '', (string) $state))))
                    ->required(),
                Forms\Components\TextInput::make('total_pay')
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => is_numeric($state) ? (float) $state : (float) str_replace(',', '.', str_replace('.', '', preg_replace('/[^0-9,.-]/', '', (string) $state))))
                    ->required()
                    // Hapus konfigurasi numeric()/prefix('Rp') duplikat jika masih ada dalam file
                    ->required(),
                Forms\Components\DatePicker::make('payment_date'),
                Forms\Components\Select::make('status')
                    ->options([
                        'Pending' => 'Pending',
                        'Paid' => 'Paid',
                        'Cancelled' => 'Cancelled',
                    ])
                    ->default('Pending')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('pay_period_start')
            ->columns([
                Tables\Columns\TextColumn::make('pay_period_start')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('pay_period_end')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('basic_salary')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format((float) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_pay')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format((float) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Paid' => 'success',
                        'Pending' => 'warning',
                        'Cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('payment_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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