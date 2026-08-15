import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import productRoutes from '@/routes/product';
import { Product } from '@/types/models';
import { Head, useForm, usePage } from '@inertiajs/react';

type PageProps = {
    data: Product | undefined;
};

export default function ProductStockMovement() {
    const { data: product } = usePage<PageProps>().props;

    const { data, setData, processing, errors, submit } = useForm({
        movement_type: '',
        quantity: '',
        notes: '',
    });

    const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (product) submit(productRoutes.storeStockMovement(product?.id));
    };

    const stockResult = ({
        stock_quantity,
        quantity,
        movement_type,
    }: {
        stock_quantity: number;
        quantity: number | string;
        movement_type: string;
    }) => {
        const numQty = Number(quantity) || 0;

        if (movement_type === 'in') {
            return stock_quantity + numQty;
        }

        if (movement_type === 'out') {
            return stock_quantity - numQty;
        }

        if (movement_type === 'adjustment') {
            return numQty;
        }

        return stock_quantity;
    };

    return (
        <>
            <Head title="Product Adjust Stock" />

            <div className="px-4 py-6">
                <h1 className="sr-only">Product Adjust Stock</h1>

                <Heading title="Product Adjust Stock" />

                <form
                    onSubmit={onSubmitForm}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                defaultValue={product?.name ?? ''}
                                name="name"
                                readOnly
                                autoComplete="name"
                                placeholder="Product name"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            className="mt-1 block w-full"
                            defaultValue={product?.stock_quantity ?? ''}
                            name="stock"
                            readOnly
                            placeholder="Stock"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="movement_type">Movement Type</Label>
                        <NativeSelect
                            id="movement_type"
                            name="movement_type"
                            className="mt-1 block w-full"
                            required
                            onChange={(e) =>
                                setData('movement_type', e.target.value)
                            }
                        >
                            <NativeSelectOption>
                                Select Movement Type
                            </NativeSelectOption>
                            <NativeSelectOption value="in">
                                Stock In
                            </NativeSelectOption>
                            <NativeSelectOption value="out">
                                Stock Out
                            </NativeSelectOption>
                            <NativeSelectOption value="adjustment">
                                Adjustment
                            </NativeSelectOption>
                        </NativeSelect>

                        <InputError
                            className="mt-2"
                            message={errors.movement_type}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            className="mt-1 block w-full"
                            name="quantity"
                            required
                            placeholder="Product quantity"
                            onChange={(e) =>
                                setData('quantity', e.target.value)
                            }
                        />

                        <InputError
                            className="mt-2"
                            message={errors.quantity}
                        />
                    </div>

                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="notes">Notes/Reason</Label>
                        <Textarea
                            id="notes"
                            className="mt-1 block w-full"
                            name="notes"
                            required
                            placeholder="Notes/Reason for stock movement"
                            onChange={(e) => setData('notes', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.notes} />
                    </div>

                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="result">Stock Result</Label>
                        <Input
                            id="result"
                            className="mt-1 block w-full"
                            name="result"
                            value={stockResult({
                                stock_quantity: product?.stock_quantity ?? 0,
                                quantity: data.quantity ?? 0,
                                movement_type: data.movement_type ?? '',
                            })}
                            readOnly
                            placeholder="Stock Result"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing} type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductStockMovement.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href: productRoutes.index(),
        },
        {
            title: 'Product Adjust Stock',
            href: productRoutes.index(),
        },
    ],
};
