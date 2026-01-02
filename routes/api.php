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

// Tambah: HR Documents
Route::apiResource('documents', \App\Http\Controllers\Api\HrDocumentController::class);
Route::post('documents/{document}/versions', [\App\Http\Controllers\Api\HrDocumentController::class, 'addVersion']);
Route::get('documents/{document}/versions/{version}/download', [\App\Http\Controllers\Api\HrDocumentController::class, 'download']);

// Tambah: Approvals
Route::prefix('approvals')->group(function () {
    Route::get('rules', [\App\Http\Controllers\Api\ApprovalController::class, 'rulesIndex']);
    Route::post('rules', [\App\Http\Controllers\Api\ApprovalController::class, 'rulesUpsert']);
    Route::get('requests', [\App\Http\Controllers\Api\ApprovalController::class, 'requestsIndex']);
    Route::post('requests', [\App\Http\Controllers\Api\ApprovalController::class, 'requestsStore']);
    Route::post('requests/{approvalRequest}/approve', [\App\Http\Controllers\Api\ApprovalController::class, 'approve']);
    Route::post('requests/{approvalRequest}/reject', [\App\Http\Controllers\Api\ApprovalController::class, 'reject']);
});

// Recruitment Routes
Route::get('job-postings', [\App\Http\Controllers\Api\JobPostingController::class, 'index']);
Route::get('job-postings/{jobPosting}', [\App\Http\Controllers\Api\JobPostingController::class, 'show']);
Route::post('applicants', [\App\Http\Controllers\Api\ApplicantController::class, 'store']);
