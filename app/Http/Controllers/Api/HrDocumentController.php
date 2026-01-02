<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HrDocument;
use App\Models\HrDocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class HrDocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = HrDocument::with('latestVersion')
            ->when($request->get('category'), function ($q, $cat) {
                $q->where('category', $cat);
            })
            ->when($request->get('status'), function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderByDesc('created_at');

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['contract', 'warning', 'policy'])],
            // Untuk dokumen policy, departemen wajib; untuk contract/warning, karyawan wajib
            'department_id' => ['nullable', 'exists:departments,id', Rule::requiredIf(fn () => $request->input('category') === 'policy')],
            'employee_id' => ['nullable', 'exists:employees,id', Rule::requiredIf(fn () => in_array($request->input('category'), ['contract', 'warning']))],
            // effective_date wajib jika expiry_date diisi agar aturan perbandingan valid
            'effective_date' => ['nullable', 'date', 'required_with:expiry_date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
            'file' => ['required', 'file'],
            'notes' => ['nullable', 'string'],
        ]);

        $document = HrDocument::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'department_id' => $validated['department_id'] ?? null,
            'employee_id' => $validated['employee_id'] ?? null,
            'effective_date' => $validated['effective_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'status' => 'active',
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        $path = $request->file('file')->store('private/hr_documents/'. $document->id);

        HrDocumentVersion::create([
            'hr_document_id' => $document->id,
            'version_number' => 1,
            'file_path' => $path,
            'notes' => $validated['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        return response()->json($document->load('latestVersion'), 201);
    }

    public function show(HrDocument $document)
    {
        $document->load(['versions' => function ($q) {
            $q->orderByDesc('version_number');
        }]);
        return response()->json($document);
    }

    public function update(Request $request, HrDocument $document)
    {
        $category = $request->input('category', $document->category);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', Rule::in(['contract', 'warning', 'policy'])],
            'department_id' => ['nullable', 'exists:departments,id', Rule::requiredIf(fn () => $category === 'policy')],
            'employee_id' => ['nullable', 'exists:employees,id', Rule::requiredIf(fn () => in_array($category, ['contract', 'warning']))],
            'effective_date' => ['nullable', 'date', 'required_with:expiry_date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
            'status' => ['sometimes', Rule::in(['active', 'archived'])],
        ]);

        $document->fill($validated);
        $document->updated_by = Auth::id();
        $document->save();

        return response()->json($document->refresh()->load('latestVersion'));
    }

    public function destroy(HrDocument $document)
    {
        $document->delete();
        return response()->noContent();
    }

    public function addVersion(Request $request, HrDocument $document)
    {
        $validated = $request->validate([
            'file' => ['required', 'file'],
            'notes' => ['nullable', 'string'],
        ]);

        $lastVersion = $document->versions()->max('version_number') ?? 0;
        $nextVersion = $lastVersion + 1;

        $path = $request->file('file')->store('private/hr_documents/'. $document->id);

        $version = HrDocumentVersion::create([
            'hr_document_id' => $document->id,
            'version_number' => $nextVersion,
            'file_path' => $path,
            'notes' => $validated['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        return response()->json($version, 201);
    }

    public function download(HrDocument $document, HrDocumentVersion $version)
    {
        if ($version->hr_document_id !== $document->id) {
            return response()->json(['message' => 'Version mismatch'], 422);
        }
        if (!Storage::exists($version->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        return Storage::download($version->file_path);
    }
}