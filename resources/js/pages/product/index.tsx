import { Button } from '@/components/ui/button';
import productRoutes from '@/routes/product';
import { Product } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';

type PageProps = {
    data: Product[];
};

export default function ProductIndex() {
    const { data } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Product" />
            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Product
                    </h1>
                    <Button asChild>
                        <Link href={productRoutes.create()}>
                            Create Product
                            <Plus className="size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="my-8 flex flex-col gap-4">
                    {data.length > 0 ? (
                        <>
                            {data.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 rounded-lg bg-muted/30 p-4 hover:bg-muted/50"
                                >
                                    <p className="flex-1">{product.name}</p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Link
                                            href={
                                                productRoutes.edit(product.id)
                                                    .url
                                            }
                                        >
                                            <Edit className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="destructive"
                                        size="icon"
                                    >
                                        <Link
                                            href={productRoutes.destroy(
                                                product.id,
                                            )}
                                        >
                                            <Trash className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No Product Found</p>
                    )}
                </div>
            </div>
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [
        {
            title: 'Product',
            href: productRoutes.index(),
        },
    ],
};
