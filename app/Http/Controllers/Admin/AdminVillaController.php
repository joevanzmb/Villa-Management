<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVillaController extends Controller
{
    public function index()
    {
        $villas = Villa::withCount('bookings')->get();
        return Inertia::render('Admin/Villas/Index', ['villas' => $villas]);
    }

    public function edit(Villa $villa)
    {
        return Inertia::render('Admin/Villas/Edit', ['villa' => $villa]);
    }

    public function update(Request $request, Villa $villa)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
        ]);

        $villa->update($request->all());
        return back()->with('success', 'Data villa berhasil diperbarui.');
    }
}
