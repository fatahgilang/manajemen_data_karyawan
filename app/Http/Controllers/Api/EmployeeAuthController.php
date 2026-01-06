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
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $employee = Employee::where('email', $validated['email'])->first();

        if (!$employee) {
            return response()->json(['message' => 'Email atau password salah'], 422);
        }

        $isValid = false;
        if ($employee->password) {
            try {
                $isValid = Hash::check($validated['password'], $employee->password);
            } catch (\RuntimeException $e) {
                $isValid = false; // Stored hash not in bcrypt format
            }

            // Fallback: legacy plain-text password stored in DB
            if (!$isValid && !str_starts_with((string)$employee->password, '$2y$')) {
                if (hash_equals((string)$employee->password, (string)$validated['password'])) {
                    // Rehash to bcrypt via Eloquent 'hashed' cast on assignment
                    $employee->password = $validated['password'];
                    $employee->save();
                    $isValid = true;
                }
            }
        }

        if (!$isValid) {
            return response()->json(['message' => 'Email atau password salah'], 422);
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
