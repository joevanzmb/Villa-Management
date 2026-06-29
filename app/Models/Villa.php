<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Villa extends Model
{
    protected $fillable = ['name', 'description', 'price_per_night', 'weekday_price', 'weekend_price', 'extra_bed_price', 'max_guests', 'bedrooms', 'bathrooms', 'has_kitchen', 'check_in_time', 'check_out_time', 'house_rules'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
