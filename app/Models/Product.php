<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $category_id
 * @property string $sku
 * @property string $name
 * @property float|string $price
 * @property float|string $cost_price
 * @property int $stock_quantity
 * @property int $stock_threshold
 * @property string $unit
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'sku', 'category_id', 'price', 'cost_price', 'stock_quantity', 'stock_threshold', 'unit'])]
class Product extends Model
{
    protected $casts = [
        'price' => 'float',
        'cost_price' => 'float',
    ];
}
