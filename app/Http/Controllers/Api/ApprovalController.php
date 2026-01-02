<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApprovalRequest;
use App\Models\ApprovalStep;
use App\Models\DepartmentApprovalRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ApprovalController extends Controller
{
    // ===== Rules =====
    public function rulesIndex(Request $request)
    {
        $query = DepartmentApprovalRule::with('department')
            ->when($request->get('department_id'), fn($q, $d) => $q->where('department_id', $d))
            ->when($request->get('type'), fn($q, $t) => $q->where('type', $t));
        return response()->json($query->paginate(20));
    }

    public function rulesUpsert(Request $request)
    {
        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'type' => ['required', Rule::in(['leave', 'overtime', 'reimburse', 'cuti', 'sakit', 'keperluan'])],
            'steps_json' => ['required', 'array', 'min:1'],
            'steps_json.*.approver_type' => ['required', Rule::in(['role', 'employee'])],
            'steps_json.*.approver_role' => ['nullable', 'string'],
            'steps_json.*.approver_employee_id' => ['nullable', 'exists:employees,id'],
        ]);

        $rule = DepartmentApprovalRule::updateOrCreate(
            ['department_id' => $validated['department_id'], 'type' => $validated['type']],
            ['steps_json' => $validated['steps_json']]
        );

        return response()->json($rule->refresh(), 201);
    }

    // ===== Requests =====
    public function requestsIndex(Request $request)
    {
        $query = ApprovalRequest::with(['department', 'requester', 'steps'])
            ->when($request->get('type'), fn($q, $t) => $q->where('type', $t))
            ->when($request->get('status'), fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at');
        return response()->json($query->paginate(20));
    }

    public function requestsStore(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(['leave', 'overtime', 'reimburse', 'cuti', 'sakit', 'keperluan'])],
            'requester_employee_id' => ['required', 'exists:employees,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'payload' => ['nullable', 'array'],
        ]);

        $rule = DepartmentApprovalRule::where('department_id', $validated['department_id'])
            ->where('type', $validated['type'])
            ->first();

        if (!$rule) {
            return response()->json(['message' => 'Approval rule not configured'], 422);
        }

        // Defensive casting for numeric-like payloads
        $payload = $validated['payload'] ?? [];
        if (is_array($payload)) {
            if (isset($payload['days'])) {
                $payload['days'] = (int) $payload['days'];
            }
        }

        $requestModel = ApprovalRequest::create([
            'type' => $validated['type'],
            'requester_employee_id' => $validated['requester_employee_id'],
            'department_id' => $validated['department_id'],
            'payload' => $payload,
            'status' => 'pending',
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        foreach ($rule->steps_json as $idx => $step) {
            ApprovalStep::create([
                'approval_request_id' => $requestModel->id,
                'step_order' => $idx + 1,
                'approver_type' => $step['approver_type'] ?? 'role',
                'approver_role' => $step['approver_role'] ?? null,
                'approver_employee_id' => $step['approver_employee_id'] ?? null,
                'status' => 'pending',
            ]);
        }

        return response()->json($requestModel->load('steps'), 201);
    }

    public function approve(Request $request, ApprovalRequest $approvalRequest)
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $currentStep = $approvalRequest->steps()->where('status', 'pending')->orderBy('step_order')->first();
        if (!$currentStep) {
            return response()->json(['message' => 'No pending step'], 422);
        }

        $currentStep->status = 'approved';
        $currentStep->decision_by = Auth::id();
        $currentStep->decision_at = now();
        $currentStep->notes = $validated['notes'] ?? null;
        $currentStep->save();

        $nextPending = $approvalRequest->steps()->where('status', 'pending')->exists();
        if (!$nextPending) {
            $approvalRequest->status = 'approved';
            $approvalRequest->updated_by = Auth::id();
            $approvalRequest->save();
        }

        return response()->json($approvalRequest->load('steps'));
    }

    public function reject(Request $request, ApprovalRequest $approvalRequest)
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $currentStep = $approvalRequest->steps()->where('status', 'pending')->orderBy('step_order')->first();
        if (!$currentStep) {
            return response()->json(['message' => 'No pending step'], 422);
        }

        $currentStep->status = 'rejected';
        $currentStep->decision_by = Auth::id();
        $currentStep->decision_at = now();
        $currentStep->notes = $validated['notes'] ?? null;
        $currentStep->save();

        $approvalRequest->status = 'rejected';
        $approvalRequest->updated_by = Auth::id();
        $approvalRequest->save();

        return response()->json($approvalRequest->load('steps'));
    }
}