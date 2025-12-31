<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\PayrollResource\Pages;
use App\Filament\Admin\Resources\PayrollResource\RelationManagers;
use App\Models\Payroll;
use App\Models\Attendance;
use App\Models\Employee;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Support\RawJs;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ViewAction;
use Illuminate\Support\Carbon;

class PayrollResource extends Resource
{
    protected static ?string $model = Payroll::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
protected static ?string $modelLabel = 'Penggajian';
protected static ?string $pluralModelLabel = 'Penggajian';
protected static ?string $navigationLabel = 'Penggajian';
protected static ?string $navigationGroup = 'Keuangan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('employee_id')
                    ->label('Karyawan')
                    ->relationship('employee', 'name', modifyQueryUsing: fn (Builder $query) => $query->whereHas('applicant', fn ($q) => $q->where('status', 'Hired')))
                    ->searchable()
                    ->preload()
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                        self::syncBasicSalaryFromPosition($state, $set);
                        self::recalcTotal($set, $get);
                    })
                    ->required(),
                Forms\Components\DatePicker::make('pay_period_start')
                    ->label('Periode Mulai')
                    ->default(fn () => now()->startOfMonth())
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set, callable $get) => self::recalcTotal($set, $get))
                    ->required(),
                Forms\Components\DatePicker::make('pay_period_end')
                    ->label('Periode Selesai')
                    ->default(fn () => now()->endOfMonth())
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set, callable $get) => self::recalcTotal($set, $get))
                    ->required(),
                Forms\Components\TextInput::make('basic_salary')
                    ->label('Gaji Pokok')
                    ->helperText('Masukkan gaji pokok bulanan')
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => self::parseCurrency($state))
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set, callable $get) => self::recalcTotal($set, $get))
                    ->required(),
                Forms\Components\TextInput::make('allowances')
                    ->label('Tunjangan')
                    ->default(0)
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => self::parseCurrency($state))
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set, callable $get) => self::recalcTotal($set, $get)),
                Forms\Components\TextInput::make('deductions')
                    ->label('Potongan')
                    ->default(0)
                    ->prefix('Rp ')
                    ->mask(RawJs::make('$money($input, ".", ",", 0)'))
                    ->dehydrateStateUsing(fn ($state) => self::parseCurrency($state))
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set, callable $get) => self::recalcTotal($set, $get)),
                Forms\Components\TextInput::make('total_pay')
                    ->label('Total Gaji')
                    ->readOnly()
                    ->dehydrated(true)
                    ->prefix('Rp ')
                    ->formatStateUsing(fn ($state) => number_format((float) $state, 0, ',', '.'))
                    ->helperText(function (callable $get) {
                        $employeeId = $get('employee_id');
                        $start = $get('pay_period_start');
                        $end = $get('pay_period_end');
                        if (!($employeeId && $start && $end)) {
                            return 'Isi karyawan dan periode untuk melihat ringkasan perhitungan.';
                        }
                        $startDate = Carbon::parse($start)->startOfDay();
                        $endDate = Carbon::parse($end)->endOfDay();
                        $attendanceCount = Attendance::query()
                            ->where('employee_id', $employeeId)
                            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                            ->whereNotNull('clock_in')
                            ->count();
                        $effectiveWorkdays = self::countWorkdays($startDate, $endDate);
                        $monthly = (float) ($get('basic_salary') ?? 0);
                        $allow = (float) ($get('allowances') ?? 0);
                        $deduct = (float) ($get('deductions') ?? 0);
                        $perDay = $effectiveWorkdays > 0 ? ($monthly / $effectiveWorkdays) : 0;
                        return 'Hadir: ' . $attendanceCount . ' hari; Hari kerja efektif: ' . $effectiveWorkdays . '; Per hari: Rp ' . number_format($perDay, 0, ',', '.') . '; Rumus: (per hari × hadir) + tunjangan − potongan';
                    })
                    ->required(),
                Forms\Components\DatePicker::make('payment_date'),
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'Pending' => 'Menunggu',
                        'Paid' => 'Dibayar',
                        'Cancelled' => 'Dibatalkan',
                    ])
                    ->default('Pending')
                    ->required(),
            ]);
    }

    protected static function syncBasicSalaryFromPosition(?string $employeeId, callable $set): void
    {
        if (!$employeeId) return;
        $employee = Employee::query()->with('position')->find($employeeId);
        if ($employee && $employee->position && $employee->position->base_salary !== null) {
            $set('basic_salary', (float) $employee->position->base_salary);
        }
    }

    protected static function recalcTotal(callable $set, callable $get): void
    {
        $employeeId = $get('employee_id');
        $start = $get('pay_period_start');
        $end = $get('pay_period_end');

        $attendanceCount = 0;
        $effectiveWorkdays = 0;

        if ($employeeId && $start && $end) {
            $startDate = Carbon::parse($start)->startOfDay();
            $endDate = Carbon::parse($end)->endOfDay();

            $attendanceCount = Attendance::query()
                ->where('employee_id', $employeeId)
                ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->whereNotNull('clock_in')
                ->count();

            $effectiveWorkdays = self::countWorkdays($startDate, $endDate);
        }

        $monthly = self::parseCurrency($get('basic_salary') ?? 0);
        $allow = self::parseCurrency($get('allowances') ?? 0);
        $deduct = self::parseCurrency($get('deductions') ?? 0);

        $perDay = $effectiveWorkdays > 0 ? ($monthly / $effectiveWorkdays) : 0;
        $total = ($perDay * $attendanceCount) + $allow - $deduct;

        $set('total_pay', $total);
    }

    protected static function countWorkdays(Carbon $start, Carbon $end): int
    {
        $days = 0;
        $date = $start->copy();
        while ($date->lte($end)) {
            if (!in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY], true)) {
                $days++;
            }
            $date->addDay();
        }
        return $days;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('employee.id')
                    ->label('ID Karyawan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('pay_period_start')
                    ->label('Periode Mulai')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('pay_period_end')
                    ->label('Periode Selesai')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('basic_salary')
                    ->label('Gaji Pokok')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format((float) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_pay')
                    ->label('Total Gaji')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format((float) $state, 0, ',', '.'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Paid' => 'success',
                        'Pending' => 'warning',
                        'Cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Tanggal Pembayaran')
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
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListPayrolls::route('/'),
            'create' => Pages\CreatePayroll::route('/create'),
            'edit' => Pages\EditPayroll::route('/{record}/edit'),
        ];
    }

    protected static function parseCurrency($value): float
    {
        if ($value === null || $value === '') return 0.0;
        if (is_numeric($value)) return (float) $value;
        $normalized = preg_replace('/[^0-9,.-]/', '', (string) $value);
        $normalized = str_replace('.', '', $normalized);
        $normalized = str_replace(',', '.', $normalized);
        return (float) $normalized;
    }
}
