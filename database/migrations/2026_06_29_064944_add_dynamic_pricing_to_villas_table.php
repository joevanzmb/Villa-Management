<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('villas', function (Blueprint $table) {
            $table->decimal('weekday_price', 15, 2)->default(400000)->after('price_per_night');
            $table->decimal('weekend_price', 15, 2)->default(600000)->after('weekday_price');
            $table->decimal('extra_bed_price', 15, 2)->default(100000)->after('weekend_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('villas', function (Blueprint $table) {
            $table->dropColumn(['weekday_price', 'weekend_price', 'extra_bed_price']);
        });
    }
};
