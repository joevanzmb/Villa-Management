<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminVillaController;
use App\Http\Controllers\Admin\AdminCustomerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/book', [BookingController::class, 'create'])->name('book.create');
Route::post('/book', [BookingController::class, 'store'])->name('book.store');
Route::post('/check-availability', [BookingController::class, 'checkAvailability'])->name('book.checkAvailability');

// Admin routes
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/pesanan', [AdminBookingController::class, 'index'])->name('admin.bookings.index');
    Route::get('/pesanan/{booking}', [AdminBookingController::class, 'show'])->name('admin.bookings.show');
    Route::patch('/pesanan/{booking}/status', [AdminBookingController::class, 'updateStatus'])->name('admin.bookings.updateStatus');

    Route::get('/villa', [AdminVillaController::class, 'index'])->name('admin.villas.index');
    Route::get('/villa/{villa}/edit', [AdminVillaController::class, 'edit'])->name('admin.villas.edit');
    Route::patch('/villa/{villa}', [AdminVillaController::class, 'update'])->name('admin.villas.update');

    Route::get('/pelanggan', [AdminCustomerController::class, 'index'])->name('admin.customers.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
