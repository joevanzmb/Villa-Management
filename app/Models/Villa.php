<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Villa extends Model
{
    protected $fillable = ['name', 'description', 'price_per_night', 'max_guests', 'bedrooms', 'bathrooms', 'has_kitchen', 'check_in_time', 'check_out_time', 'house_rules'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
