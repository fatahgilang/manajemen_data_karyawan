<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// HR Management Routes
Route::apiResource('employees', \App\Http\Controllers\Api\EmployeeController::class);
Route::apiResource('departments', \App\Http\Controllers\Api\DepartmentController::class);
Route::apiResource('positions', \App\Http\Controllers\Api\PositionController::class);
