<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = ['customer_id', 'villa_id', 'check_in', 'check_out', 'total_nights', 'guest_count', 'special_request', 'price_per_night', 'cleaning_fee', 'discount', 'taxes', 'grand_total', 'status'];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }
    public function villa() {
        return $this->belongsTo(Villa::class);
    }
}
