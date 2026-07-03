<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Villa;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    public function create()
    {
        // Assuming Villa 1 is the main De Villa Sani
        $villa = Villa::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'De Villa Sani',
                'description' => 'Luxury mountain view villa in Batu.',
                'price_per_night' => 2500000,
                'max_guests' => 8,
                'bedrooms' => 4,
                'bathrooms' => 3,
            ]
        );

        return Inertia::render('Public/Book', [
            'villa' => $villa
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guest_count' => 'required|string',
            'special_request' => 'nullable|string',
        ]);

        $villa = Villa::findOrFail(1);
        
        $priceData = $this->calculatePrice($request->check_in, $request->check_out, $request->guest_count, $villa);
        $totalNights = $priceData['total_nights'];
        $grandTotal = $priceData['grand_total'];
        $pricePerNight = $priceData['avg_price_per_night'];

        // Konversi guest_count text ke integer untuk database
        $guestNumber = 3;
        if ($request->guest_count === '4-6 Orang') $guestNumber = 6;
        if ($request->guest_count === '7-10 Orang') $guestNumber = 10;

        $customer = Customer::firstOrCreate(
            ['email' => $request->email],
            ['name' => $request->name, 'phone' => $request->phone]
        );

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'villa_id' => 1,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'total_nights' => $totalNights,
            'guest_count' => $guestNumber,
            'special_request' => $request->special_request,
            'price_per_night' => $pricePerNight,
            'grand_total' => $grandTotal,
            'status' => 'Pending'
        ]);

        $orderId = 'DVS-' . $booking->id . '-' . time();

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'transaction_id' => $orderId,
            'amount' => $grandTotal,
            'status' => 'Pending'
        ]);

        // Midtrans Config
        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        \Midtrans\Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        $params = array(
            'transaction_details' => array(
                'order_id' => $orderId,
                'gross_amount' => $grandTotal,
            ),
            'customer_details' => array(
                'first_name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
            ),
        );

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|string'
        ]);

        $checkIn = Carbon::parse($request->check_in);
        $checkOut = Carbon::parse($request->check_out);
        $totalNights = $checkIn->diffInDays($checkOut);

        // Cari overlapping dates
        $overlappingBookings = Booking::where('villa_id', 1)
            ->whereIn('status', ['Confirmed', 'Checked In', 'Completed'])
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut->format('Y-m-d'))
                      ->where('check_out', '>', $checkIn->format('Y-m-d'));
            })
            ->get();

        // Cari seluruh tanggal yang sudah ter-booking ke depannya (untuk di-disable di kalender)
        $allFutureBookings = Booking::where('villa_id', 1)
            ->whereIn('status', ['Confirmed', 'Checked In', 'Completed'])
            ->where('check_out', '>=', now()->format('Y-m-d'))
            ->get();

        $bookedDates = [];
        foreach ($allFutureBookings as $b) {
            $start = Carbon::parse($b->check_in);
            $end = Carbon::parse($b->check_out);
            while ($start < $end) { // exclude check-out day because someone else can check-in on that day
                $bookedDates[] = $start->format('Y-m-d');
                $start->addDay();
            }
        }

        if ($overlappingBookings->count() > 0) {
            return response()->json([
                'available' => false,
                'message' => 'Maaf, Vila sudah terpesan pada rentang tanggal tersebut.',
                'booked_dates' => $bookedDates
            ]);
        }

        $villa = Villa::findOrFail(1);
        $priceData = $this->calculatePrice($request->check_in, $request->check_out, $request->guests, $villa);

        return response()->json([
            'available' => true,
            'price_per_night' => $priceData['avg_price_per_night'],
            'total_nights' => $priceData['total_nights'],
            'grand_total' => $priceData['grand_total'],
            'booked_dates' => $bookedDates
        ]);
    }

    private function calculatePrice($checkInDate, $checkOutDate, $guests, $villa)
    {
        $start = Carbon::parse($checkInDate);
        $end = Carbon::parse($checkOutDate);
        $totalNights = $start->diffInDays($end);
        
        $grandTotal = 0;
        
        // Loop tiap malam
        $current = $start->copy();
        while ($current < $end) {
            // dayOfWeek: 0 = Sunday, 1 = Monday, ... 6 = Saturday
            $day = $current->dayOfWeek;
            
            // Jumat (5), Sabtu (6), Minggu (0) -> Weekend Price, Sisanya -> Weekday Price
            $nightPrice = in_array($day, [0, 5, 6]) ? ($villa->weekend_price ?? 900000) : ($villa->weekday_price ?? 600000);
            
            $grandTotal += $nightPrice;
            $current->addDay();
        }
        
        $avgPrice = $totalNights > 0 ? $grandTotal / $totalNights : 0;
        
        return [
            'total_nights' => $totalNights,
            'grand_total' => $grandTotal,
            'avg_price_per_night' => round($avgPrice)
        ];
    }
}
