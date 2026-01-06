<?php

namespace App\Filament\Admin\Pages;

use Filament\Pages\Page;
use Filament\Actions;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Models\Employee;

class HRDocuments extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Dokumen HR';
    protected static ?string $title = 'Dokumen HR';

    protected static string $view = 'filament.admin.pages.hr-documents';

    public static function shouldRegisterNavigation(): bool
    {
        $role = strtolower((string) (Auth::user()->role ?? ''));
        return in_array($role, ['super_admin', 'hrd'], true);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('contract')
                ->label('Buat Surat Kontrak')
                ->icon('heroicon-o-document-plus')
                ->form([
                    \Filament\Forms\Components\Select::make('employee_id')
                        ->label('Karyawan')
                        ->searchable()
                        ->options(fn () => Employee::query()
                            ->where('is_active', true)
                            ->orderBy('name')
                            ->pluck('name', 'id')
                            ->toArray())
                        ->required(),
                    \Filament\Forms\Components\TextInput::make('position')->label('Posisi/Jabatan')->required(),
                    \Filament\Forms\Components\DatePicker::make('start_date')->label('Tanggal Mulai')->required(),
                    \Filament\Forms\Components\DatePicker::make('end_date')->label('Tanggal Berakhir'),
                ])
                ->action(function (array $data) {
                    $content = "Surat Kontrak Karyawan\n\n" .
                        "Karyawan ID: {$data['employee_id']}\n" .
                        "Posisi: {$data['position']}\n" .
                        "Mulai: {$data['start_date']}\n" .
                        (!empty($data['end_date']) ? "Berakhir: {$data['end_date']}\n" : '') .
                        "\nDokumen ini merupakan placeholder. Integrasikan library PDF (mis. dompdf) untuk output PDF sebenarnya.";

                    $filename = 'kontrak_' . $data['employee_id'] . '.txt';
                    return response()->streamDownload(function () use ($content) {
                        echo $content;
                    }, $filename, [
                        'Content-Type' => 'text/plain',
                    ]);
                }),

            Actions\Action::make('warning')
                ->label('Buat Surat Peringatan')
                ->icon('heroicon-o-exclamation-triangle')
                ->form([
                    \Filament\Forms\Components\Select::make('employee_id')
                        ->label('Karyawan')
                        ->searchable()
                        ->options(fn () => Employee::query()
                            ->where('is_active', true)
                            ->orderBy('name')
                            ->pluck('name', 'id')
                            ->toArray())
                        ->required(),
                    \Filament\Forms\Components\Select::make('level')->label('Level')->options([
                        'SP1' => 'SP1', 'SP2' => 'SP2', 'SP3' => 'SP3',
                    ])->default('SP1')->required(),
                    \Filament\Forms\Components\DatePicker::make('date')->label('Tanggal')->required(),
                    \Filament\Forms\Components\Textarea::make('description')->label('Deskripsi')->required(),
                ])
                ->action(function (array $data) {
                    $content = "Surat Peringatan/Pelanggaran\n\n" .
                        "Karyawan ID: {$data['employee_id']}\n" .
                        "Level: {$data['level']}\n" .
                        "Tanggal: {$data['date']}\n\n" .
                        "Deskripsi: {$data['description']}\n\n" .
                        "Dokumen ini merupakan placeholder. Integrasikan library PDF (mis. dompdf) untuk output PDF sebenarnya.";

                    $filename = 'surat_peringatan_' . $data['employee_id'] . '.txt';
                    return response()->streamDownload(function () use ($content) {
                        echo $content;
                    }, $filename, [
                        'Content-Type' => 'text/plain',
                    ]);
                }),
        ];
    }
}
