<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('admin/login', [AuthenticatedSessionController::class, 'create'])
        ->name('admin.login');

    Route::get('login', function () {
        return redirect()->route('admin.login');
    })->name('login');

    Route::post('admin/login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.post');

    // Google OAuth Routes
    Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])
        ->name('auth.google');

    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])
        ->name('auth.google.callback');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
