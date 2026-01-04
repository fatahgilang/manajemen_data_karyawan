<?php

use Illuminate\Support\Facades\Route;
// Hapus penggunaan LoginController; gunakan login Filament
// Redirect default login ke halaman login Filament
Route::get('/login', function () { return redirect('/dash/login'); })->name('login');

Route::get('/', function () {
    $frontendPath = public_path('frontend/index.html');
    if (file_exists($frontendPath)) {
        return response()->make(file_get_contents($frontendPath), 200, ['Content-Type' => 'text/html']);
    }
    return view('welcome');
});

// Serve static assets from React build
Route::get('/assets/{file}', function ($file) {
    $assetPath = public_path('frontend/assets/' . $file);
    if (file_exists($assetPath)) {
        $mime = match (pathinfo($assetPath, PATHINFO_EXTENSION)) {
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };
        return response()->make(file_get_contents($assetPath), 200, ['Content-Type' => $mime]);
    }
    abort(404);
});

Route::get('/vite.svg', function () {
    $path = public_path('frontend/vite.svg');
    if (file_exists($path)) {
        return response()->make(file_get_contents($path), 200, ['Content-Type' => 'image/svg+xml']);
    }
    abort(404);
});

// Fallback route for React Router
Route::get('/{any}', function () {
    $frontendPath = public_path('frontend/index.html');
    if (file_exists($frontendPath)) {
        return response()->make(file_get_contents($frontendPath), 200, ['Content-Type' => 'text/html']);
    }
    return view('welcome');
})->where('any', '.*')->missing(function () {
    return view('welcome');
});
