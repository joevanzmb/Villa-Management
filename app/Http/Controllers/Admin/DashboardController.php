<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Villa;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalBookings' => Booking::count(),
            'pendingBookings' => Booking::where('status', 'Pending')->count(),
            'confirmedBookings' => Booking::where('status', 'Confirmed')->count(),
            'totalRevenue' => Payment::where('status', 'Paid')->sum('amount'),
            'totalCustomers' => Customer::count(),
            'totalVillas' => Villa::count(),
        ];

        $recentBookings = Booking::with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
        ]);
    }
}
