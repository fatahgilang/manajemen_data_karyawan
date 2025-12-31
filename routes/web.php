<?php

use Illuminate\Support\Facades\Route;
// Hapus penggunaan LoginController; gunakan login Filament
// Redirect default login ke halaman login Filament
Route::get('/login', function () { return redirect('/admin/login'); })->name('login');

Route::get('/', function () {
    return view('welcome');
});
