<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftSchedule;
use App\Models\ShiftSwap;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class RosterController extends Controller
{
    public function swaps(Request $request)
    {
        $data = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
            'start' => 'nullable|date',
            'end' => 'nullable|date|after_or_equal:start',
            'employee_id' => 'nullable|exists:employees,id',
        ]);
        $query = ShiftSwap::with(['requester', 'target', 'originalShift', 'newShift'])->orderByDesc('created_at');
        if (!empty($data['status'])) {
            $query->where('status', $data['status']);
        }
        if (!empty($data['start']) && !empty($data['end'])) {
            $query->whereBetween('date', [$data['start'], $data['end']]);
        }
        if (!empty($data['employee_id'])) {
            $query->where(function ($q) use ($data) {
                $q->where('requester_employee_id', $data['employee_id'])
                    ->orWhere('target_employee_id', $data['employee_id']);
            });
        }
        return response()->json($query->get());
    }
    public function schedules(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);

        $query = ShiftSchedule::with(['shift', 'employee'])
            ->whereBetween('date', [$data['start'], $data['end']])
            ->orderBy('date');

        if (!empty($data['employee_id'])) {
            $query->where('employee_id', $data['employee_id']);
        }

        return response()->json($query->get());
    }

    public function generate(Request $request)
    {
        $data = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'exists:employees,id',
            'start_date' => 'required|date',
            'days' => 'required|integer|min:1|max:180',
            'pattern' => 'required|array|min:1',
            'pattern.*' => 'exists:shifts,id',
            'rotation' => ['required', Rule::in(['daily', 'weekly'])],
        ]);

        $start = Carbon::parse($data['start_date']);
        $days = (int) $data['days'];
        $pattern = $data['pattern'];
        $rotation = $data['rotation'];

        foreach ($data['employee_ids'] as $idx => $employeeId) {
            $employee = Employee::findOrFail($employeeId);
            for ($d = 0; $d < $days; $d++) {
                $date = $start->copy()->addDays($d)->toDateString();
                $patternIndex = $rotation === 'daily'
                    ? ($idx + $d) % count($pattern)
                    : ($idx + floor($d / 7)) % count($pattern);
                $shiftId = $pattern[$patternIndex];

                ShiftSchedule::updateOrCreate(
                    ['employee_id' => $employee->id, 'date' => $date],
                    ['shift_id' => $shiftId, 'status' => 'assigned']
                );
            }
        }

        return response()->json(['message' => 'Roster generated']);
    }

    public function requestSwap(Request $request)
    {
        $data = $request->validate([
            'requester_employee_id' => 'required|exists:employees,id',
            'target_employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
        ]);

        $reqSchedule = ShiftSchedule::where('employee_id', $data['requester_employee_id'])
            ->where('date', $data['date'])->first();
        $targetSchedule = ShiftSchedule::where('employee_id', $data['target_employee_id'])
            ->where('date', $data['date'])->first();

        if (!$reqSchedule || !$targetSchedule) {
            return response()->json(['message' => 'Schedules not found on date'], 422);
        }

        $swap = ShiftSwap::create([
            'requester_employee_id' => $data['requester_employee_id'],
            'target_employee_id' => $data['target_employee_id'],
            'date' => $data['date'],
            'original_shift_id' => $reqSchedule->shift_id,
            'new_shift_id' => $targetSchedule->shift_id,
            'status' => 'pending',
        ]);

        return response()->json($swap, 201);
    }

    public function approveSwap(Request $request, ShiftSwap $swap)
    {
        if ($swap->status !== 'pending') {
            return response()->json(['message' => 'Swap already processed'], 422);
        }

        $reqSchedule = ShiftSchedule::where('employee_id', $swap->requester_employee_id)
            ->where('date', $swap->date)->first();
        $targetSchedule = ShiftSchedule::where('employee_id', $swap->target_employee_id)
            ->where('date', $swap->date)->first();

        if (!$reqSchedule || !$targetSchedule) {
            return response()->json(['message' => 'Schedules not found on date'], 422);
        }

        $reqShift = $reqSchedule->shift_id;
        $targetShift = $targetSchedule->shift_id;

        $reqSchedule->update(['shift_id' => $targetShift, 'status' => 'swapped']);
        $targetSchedule->update(['shift_id' => $reqShift, 'status' => 'swapped']);

        $swap->update([
            'status' => 'approved',
            'approved_by' => optional($request->user())->id,
            'approved_at' => now(),
        ]);

        return response()->json(['message' => 'Swap approved']);
    }

    public function rejectSwap(Request $request, ShiftSwap $swap)
    {
        if ($swap->status !== 'pending') {
            return response()->json(['message' => 'Swap already processed'], 422);
        }

        $swap->update([
            'status' => 'rejected',
            'approved_by' => optional($request->user())->id,
            'approved_at' => now(),
        ]);

        return response()->json(['message' => 'Swap rejected']);
    }
}
