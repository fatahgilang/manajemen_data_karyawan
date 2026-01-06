<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class HRDocumentsController extends Controller
{
    public function generateContract(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'position' => 'required|string',
        ]);

        $content = "Surat Kontrak Karyawan\n\n" .
            "Karyawan ID: {$data['employee_id']}\n" .
            "Posisi: {$data['position']}\n" .
            "Mulai: {$data['start_date']}\n" .
            (isset($data['end_date']) ? "Berakhir: {$data['end_date']}\n" : '') .
            "\nDokumen ini merupakan placeholder. Integrasikan library PDF (mis. dompdf) untuk output PDF sebenarnya.";

        $filename = 'kontrak_' . $data['employee_id'] . '.pdf';
        return Response::make($content, 200, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function generateWarning(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|integer',
            'level' => 'required|string',
            'date' => 'required|date',
            'description' => 'required|string',
        ]);

        $content = "Surat Peringatan/Pelanggaran\n\n" .
            "Karyawan ID: {$data['employee_id']}\n" .
            "Level: {$data['level']}\n" .
            "Tanggal: {$data['date']}\n\n" .
            "Deskripsi: {$data['description']}\n\n" .
            "Dokumen ini merupakan placeholder. Integrasikan library PDF (mis. dompdf) untuk output PDF sebenarnya.";

        $filename = 'surat_peringatan_' . $data['employee_id'] . '.pdf';
        return Response::make($content, 200, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
