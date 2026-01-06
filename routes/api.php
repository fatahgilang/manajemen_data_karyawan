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

Route::prefix('attendances')->middleware(['employee.token','role:super_admin,hrd,admin'])->group(function () {
    Route::match(['get','post'], '/status', [\App\Http\Controllers\Api\AttendanceController::class, 'status']);
    Route::post('/check-in', [\App\Http\Controllers\Api\AttendanceController::class, 'checkIn']);
    Route::post('/check-out', [\App\Http\Controllers\Api\AttendanceController::class, 'checkOut']);
});

// HR Management Routes
Route::apiResource('employees', \App\Http\Controllers\Api\EmployeeController::class)->middleware(['employee.token','role:super_admin,hrd']);
Route::apiResource('departments', \App\Http\Controllers\Api\DepartmentController::class)->middleware(['employee.token','role:super_admin,hrd']);
Route::apiResource('positions', \App\Http\Controllers\Api\PositionController::class)->middleware(['employee.token','role:super_admin,hrd']);

// Tambah: HR Documents
Route::apiResource('documents', \App\Http\Controllers\Api\HrDocumentController::class)->middleware(['employee.token','role:super_admin,hrd']);
Route::post('documents/{document}/versions', [\App\Http\Controllers\Api\HrDocumentController::class, 'addVersion'])->middleware(['employee.token','role:super_admin,hrd']);
Route::get('documents/{document}/versions/{version}/download', [\App\Http\Controllers\Api\HrDocumentController::class, 'download'])->middleware(['employee.token','role:super_admin,hrd']);

// Tambah: Approvals (protected)
Route::prefix('approvals')->middleware(['employee.token','role:super_admin,hrd'])->group(function () {
    Route::get('rules', [\App\Http\Controllers\Api\ApprovalController::class, 'rulesIndex']);
    Route::post('rules', [\App\Http\Controllers\Api\ApprovalController::class, 'rulesUpsert']);
    Route::get('requests', [\App\Http\Controllers\Api\ApprovalController::class, 'requestsIndex']);
    Route::post('requests', [\App\Http\Controllers\Api\ApprovalController::class, 'requestsStore']);
    Route::post('requests/{approvalRequest}/approve', [\App\Http\Controllers\Api\ApprovalController::class, 'approve']);
    Route::post('requests/{approvalRequest}/reject', [\App\Http\Controllers\Api\ApprovalController::class, 'reject']);
});

// Recruitment Routes (job postings protected, applicants public)
Route::get('job-postings', [\App\Http\Controllers\Api\JobPostingController::class, 'index'])->middleware(['employee.token','role:super_admin,hrd,admin']);
Route::get('job-postings/{jobPosting}', [\App\Http\Controllers\Api\JobPostingController::class, 'show'])->middleware(['employee.token','role:super_admin,hrd,admin']);
Route::post('applicants', [\App\Http\Controllers\Api\ApplicantController::class, 'store']);

// Shift & Roster Scheduling
Route::apiResource('shifts', \App\Http\Controllers\Api\ShiftController::class)->only(['index','store','update','destroy'])->middleware(['employee.token','role:super_admin,hrd']);
Route::prefix('roster')->middleware(['employee.token','role:super_admin,hrd'])->group(function () {
    Route::get('schedules', [\App\Http\Controllers\Api\RosterController::class, 'schedules']);
    Route::get('swaps', [\App\Http\Controllers\Api\RosterController::class, 'swaps']);
    Route::post('generate', [\App\Http\Controllers\Api\RosterController::class, 'generate']);
    Route::post('schedule', [\App\Http\Controllers\Api\RosterController::class, 'setSchedule']);
    Route::post('swap', [\App\Http\Controllers\Api\RosterController::class, 'requestSwap']);
    Route::post('swap/{swap}/approve', [\App\Http\Controllers\Api\RosterController::class, 'approveSwap']);
    Route::post('swap/{swap}/reject', [\App\Http\Controllers\Api\RosterController::class, 'rejectSwap']);
});

// HR Documents generation (contracts & warnings)
Route::prefix('hr-documents')->middleware(['employee.token','role:super_admin,hrd'])->group(function () {
    Route::post('contracts', [\App\Http\Controllers\Api\HRDocumentsController::class, 'generateContract']);
    Route::post('warnings', [\App\Http\Controllers\Api\HRDocumentsController::class, 'generateWarning']);
});
