<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['booking_id', 'transaction_id', 'payment_method', 'status', 'amount', 'payment_date', 'invoice_url'];

    public function booking() {
        return $this->belongsTo(Booking::class);
    }
}
