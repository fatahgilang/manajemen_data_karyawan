<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    public function status(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string', Rule::exists('employees', 'id')],
            'date' => ['nullable', 'date'],
        ]);

        // Token-based auth: ensure bearer token matches employee
        $token = $request->bearerToken();
        $employee = Employee::where('id', $validated['employee_id'])
            ->where('api_token', $token)
            ->first();
        if (!$token || !$employee) {
            return response()->json(['message' => 'Tidak terautentikasi'], 401);
        }

        $date = isset($validated['date']) ? Carbon::parse($validated['date'])->toDateString() : now()->toDateString();

        $attendance = Attendance::where('employee_id', $validated['employee_id'])
            ->where('date', $date)
            ->first();

        return response()->json([
            'date' => $date,
            'attendance' => $attendance,
        ]);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string', Rule::exists('employees', 'id')],
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        // Token-based auth: ensure bearer token matches employee
        $token = $request->bearerToken();
        $employee = Employee::where('id', $validated['employee_id'])
            ->where('api_token', $token)
            ->first();
        if (!$token || !$employee) {
            return response()->json(['message' => 'Tidak terautentikasi'], 401);
        }

        $today = now()->toDateString();

        $attendance = Attendance::firstOrCreate(
            ['employee_id' => $employee->id, 'date' => $today],
            ['status' => 'Hadir']
        );

        if ($attendance->clock_in) {
            return response()->json(['message' => 'Sudah absen masuk hari ini', 'attendance' => $attendance], 422);
        }

        $path = $request->file('photo')->store('attendance_photos', 'public');

        $attendance->update([
            'clock_in' => now()->format('H:i:s'),
            'check_in_photo_path' => $path,
            // latitude/longitude/accuracy tidak diperlukan untuk mode kamera
        ]);

        return response()->json(['message' => 'Absen masuk berhasil', 'attendance' => $attendance]);
    }

    public function checkOut(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string', Rule::exists('employees', 'id')],
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        // Token-based auth: ensure bearer token matches employee
        $token = $request->bearerToken();
        $employee = Employee::where('id', $validated['employee_id'])
            ->where('api_token', $token)
            ->first();
        if (!$token || !$employee) {
            return response()->json(['message' => 'Tidak terautentikasi'], 401);
        }

        $today = now()->toDateString();

        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'Belum absen masuk hari ini'], 422);
        }

        if ($attendance->clock_out) {
            return response()->json(['message' => 'Sudah absen keluar hari ini', 'attendance' => $attendance], 422);
        }

        $path = $request->file('photo')->store('attendance_photos', 'public');

        $attendance->update([
            'clock_out' => now()->format('H:i:s'),
            'check_out_photo_path' => $path,
            // latitude/longitude/accuracy tidak diperlukan untuk mode kamera
        ]);

        return response()->json(['message' => 'Absen keluar berhasil', 'attendance' => $attendance]);
    }
}