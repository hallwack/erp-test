import ProductController from '@/actions/App/Http/Controllers/ProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import productRoutes from '@/routes/product';
import { Category, Product } from '@/types/models';
import { Form, Head, usePage } from '@inertiajs/react';

type PageProps = {
    data: Product | undefined;
    categories: Category[] | undefined;
};

export default function ProductForm() {
    const { data, categories } = usePage<PageProps>().props;

    console.log('ProductForm category:', categories);
    return (
        <>
            <Head title={data ? 'Edit Product' : 'Create Product'} />
            <div className="px-4 py-6">
                <h1 className="sr-only">
                    {data ? 'Edit Product' : 'Create Product'}
                </h1>

                <Heading title={data ? 'Edit Product' : 'Create Product'} />
                <Form
                    {...(data
                        ? ProductController.update.form(data.id)
                        : ProductController.store.form())}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.name ?? ''}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Product name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sku">Product SKU</Label>
                                <Input
                                    id="sku"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.sku ?? ''}
                                    name="sku"
                                    required
                                    autoComplete="sku"
                                    placeholder="Product SKU"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.sku}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category_id">
                                    Product Category
                                </Label>
                                <NativeSelect
                                    id="category_id"
                                    name="category_id"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.category_id ?? ''}
                                    required
                                >
                                    <NativeSelectOption>
                                        Select Category
                                    </NativeSelectOption>
                                    {categories ? (
                                        categories.map((item) => (
                                            <NativeSelectOption
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </NativeSelectOption>
                                        ))
                                    ) : (
                                        <NativeSelectOption>
                                            No Category Found
                                        </NativeSelectOption>
                                    )}
                                </NativeSelect>

                                <InputError
                                    className="mt-2"
                                    message={errors.category}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit">Product Unit</Label>
                                <Input
                                    id="unit"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.unit ?? ''}
                                    name="unit"
                                    required
                                    autoComplete="unit"
                                    placeholder="Product Unit"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.unit}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Product Price</Label>
                                <Input
                                    id="price"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.price ?? ''}
                                    name="price"
                                    required
                                    placeholder="Product Price"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.price}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">
                                    Product Price Cost
                                </Label>
                                <Input
                                    id="cost_price"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.cost_price ?? ''}
                                    name="cost_price"
                                    required
                                    placeholder="Product Price Cost"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.cost_price}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock_quantity">
                                    Product Stock
                                </Label>
                                <Input
                                    id="stock_quantity"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.stock_quantity ?? ''}
                                    name="stock_quantity"
                                    required
                                    placeholder="Product Stock"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.stock_quantity}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="stock_threshold">
                                    Product Stock Threshold
                                </Label>
                                <Input
                                    id="stock_threshold"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.stock_threshold ?? ''}
                                    name="stock_threshold"
                                    placeholder="Product Stock Threshold"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.stock_threshold}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} type="submit">
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ProductForm.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href: productRoutes.index(),
        },
        {
            title: 'Form',
            href: productRoutes.index(),
        },
    ],
};
