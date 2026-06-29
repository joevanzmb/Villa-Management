<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::withCount('bookings')->orderBy('created_at', 'desc')->paginate(15);
        return Inertia::render('Admin/Customers/Index', ['customers' => $customers]);
    }
}
