<?php

namespace App\Http\Middleware;

use App\Models\Employee;
use Closure;
use Illuminate\Http\Request;

class EmployeeTokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Tidak terautentikasi'], 401);
        }

        $employee = Employee::where('api_token', $token)->first();
        if (!$employee) {
            return response()->json(['message' => 'Token tidak valid'], 401);
        }

        $request->attributes->set('employee', $employee);

        return $next($request);
    }
}

