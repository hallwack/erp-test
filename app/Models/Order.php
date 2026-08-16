<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $order_number
 * @property string $customer_name
 * @property string $status
 * @property float|string $subtotal
 * @property float|string $tax
 * @property float|string $total
 * @property string $payment_status
 * @property string|null $payment_method
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['order_number', 'customer_name', 'status', 'subtotal', 'tax', 'total', 'payment_status', 'payment_method'])]
class Order extends Model
{
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
