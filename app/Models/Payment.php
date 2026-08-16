<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $order_id
 * @property string $gateway_transaction_id
 * @property string $payment_type
 * @property float|string $amount
 * @property string $status
 * @property array|null $raw_response
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['order_id', 'gateway_transaction_id', 'payment_type', 'amount', 'status', 'raw_response', 'paid_at'])]
class Payment extends Model
{
    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
