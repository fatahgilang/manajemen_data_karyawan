<?php

namespace App\Filament\Admin\Resources\ApplicantResource\Pages;

use App\Filament\Admin\Resources\ApplicantResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListApplicants extends ListRecords
{
    protected static string $resource = ApplicantResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
