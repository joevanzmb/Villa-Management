<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\Booking;

class MidtransWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $notification = json_decode($payload);
        
        $validSignatureKey = hash("sha512", $notification->order_id . $notification->status_code . $notification->gross_amount . env('MIDTRANS_SERVER_KEY'));

        if ($notification->signature_key != $validSignatureKey) {
            return response(['message' => 'Invalid signature'], 403);
        }

        $transaction = $notification->transaction_status;
        $type = $notification->payment_type;
        $orderId = $notification->order_id;
        $fraud = $notification->fraud_status;

        Log::info("Midtrans Webhook", ['order_id' => $orderId, 'status' => $transaction]);

        // Find the payment
        $payment = Payment::where('transaction_id', $orderId)->first();
        if (!$payment) {
            return response(['message' => 'Payment not found'], 404);
        }

        if ($transaction == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $payment->status = 'Pending';
                } else {
                    $payment->status = 'Paid';
                }
            }
        } else if ($transaction == 'settlement') {
            $payment->status = 'Paid';
        } else if ($transaction == 'pending') {
            $payment->status = 'Pending';
        } else if ($transaction == 'deny') {
            $payment->status = 'Failed';
        } else if ($transaction == 'expire') {
            $payment->status = 'Failed';
        } else if ($transaction == 'cancel') {
            $payment->status = 'Failed';
        }

        $payment->save();

        // Update booking status
        $booking = $payment->booking;
        if ($booking) {
            if ($payment->status == 'Paid') {
                $booking->status = 'Confirmed';
            } elseif ($payment->status == 'Failed') {
                $booking->status = 'Cancelled';
            }
            $booking->save();
        }

        return response(['message' => 'Success'], 200);
    }
}
