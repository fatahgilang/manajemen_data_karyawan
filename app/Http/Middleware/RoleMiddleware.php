<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Usage: ->middleware('role:super_admin,hrd,admin')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userRole = strtolower((string) ($user->role ?? ''));
        $roles = array_map('strtolower', $roles);

        if (empty($roles) || in_array($userRole, $roles, true)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden'], 403);
    }
}
