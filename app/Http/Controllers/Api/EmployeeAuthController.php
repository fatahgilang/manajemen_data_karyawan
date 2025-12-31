<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class EmployeeAuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $employee = Employee::where('id', $validated['employee_id'])->first();

        if (!$employee) {
            return response()->json(['message' => 'ID karyawan tidak ditemukan'], 422);
        }

        if (!$employee->password || !Hash::check($validated['password'], $employee->password)) {
            return response()->json(['message' => 'ID karyawan atau password salah'], 422);
        }

        // Generate token sederhana; simpan di kolom api_token
        $token = Str::random(60);
        $employee->api_token = $token;
        $employee->save();

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'employee_id' => $employee->id,
            'name' => $employee->name,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Tidak terautentikasi'], 401);
        }

        $employee = Employee::where('api_token', $token)->first();
        if ($employee) {
            $employee->api_token = null;
            $employee->save();
        }

        return response()->json(['message' => 'Logout berhasil']);
    }
}