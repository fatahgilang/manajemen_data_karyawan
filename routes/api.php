<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Employee auth routes (login/logout)
Route::post('employee/login', [\App\Http\Controllers\Api\EmployeeAuthController::class, 'login']);
Route::post('employee/logout', [\App\Http\Controllers\Api\EmployeeAuthController::class, 'logout']);

Route::prefix('attendances')->group(function () {
    Route::match(['get','post'], '/status', [\App\Http\Controllers\Api\AttendanceController::class, 'status']);
    Route::post('/check-in', [\App\Http\Controllers\Api\AttendanceController::class, 'checkIn']);
    Route::post('/check-out', [\App\Http\Controllers\Api\AttendanceController::class, 'checkOut']);
});

// HR Management Routes
Route::apiResource('employees', \App\Http\Controllers\Api\EmployeeController::class);
Route::apiResource('departments', \App\Http\Controllers\Api\DepartmentController::class);
Route::apiResource('positions', \App\Http\Controllers\Api\PositionController::class);

// Recruitment Routes
Route::get('job-postings', [\App\Http\Controllers\Api\JobPostingController::class, 'index']);
Route::get('job-postings/{jobPosting}', [\App\Http\Controllers\Api\JobPostingController::class, 'show']);
Route::post('applicants', [\App\Http\Controllers\Api\ApplicantController::class, 'store']);
