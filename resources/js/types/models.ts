// 1. Category
export interface Category {
    id: number;
    name: string;
    created_at: string | Date;
    updated_at: string | Date;
}

// 2. Product
export interface Product {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    description: string | null;
    price: string;
    cost_price: string;
    stock_quantity: number;
    stock_threshold: number;
    unit: string;
    image_url: string | null;
    created_at: string | Date;
    updated_at: string | Date;

    category?: Category;
}

// 3. Stock Movement
export type MovementType = 'in' | 'out' | 'adjustment';

export interface StockMovement {
    id: number;
    product_id: number;
    movement_type: MovementType;
    quantity: number;
    reference_type: string | null;
    reference_id: number | null;
    notes: string | null;
    created_at: string | Date;

    product?: Product;
}
