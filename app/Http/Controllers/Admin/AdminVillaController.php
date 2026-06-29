<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVillaController extends Controller
{
    public function settings()
    {
        $villa = Villa::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'De Villa Sani',
                'description' => 'Luxury mountain view villa in Batu.',
                'price_per_night' => 2500000,
                'weekday_price' => 400000,
                'weekend_price' => 600000,
                'extra_bed_price' => 100000,
                'max_guests' => 10,
                'bedrooms' => 4,
                'bathrooms' => 3,
            ]
        );
        return Inertia::render('Admin/Villas/Settings', ['villa' => $villa]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'weekday_price' => 'required|numeric|min:0',
            'weekend_price' => 'required|numeric|min:0',
            'extra_bed_price' => 'required|numeric|min:0',
        ]);

        $villa = Villa::findOrFail(1);
        $villa->update($request->only(['name', 'description', 'weekday_price', 'weekend_price', 'extra_bed_price']));
        
        return back()->with('success', 'Pengaturan harga berhasil diperbarui.');
    }
}
