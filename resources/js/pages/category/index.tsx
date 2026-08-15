import { Button } from '@/components/ui/button';
import categoryRoutes from '@/routes/category';
import { Category } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';

type PageProps = {
    data: Category[];
};

export default function CategoryIndex() {
    const { data } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Category" />
            <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Category
                    </h1>
                    <Button asChild>
                        <Link href={categoryRoutes.create()}>
                            Create Category
                            <Plus className="size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="my-8 flex flex-col gap-4">
                    {data.length > 0 ? (
                        <>
                            {data.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center gap-4 rounded-lg bg-muted/30 p-4 hover:bg-muted/50"
                                >
                                    <p className="flex-1">{category.name}</p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Link
                                            href={
                                                categoryRoutes.edit(category.id)
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
                                            href={categoryRoutes.destroy(
                                                category.id,
                                            )}
                                        >
                                            <Trash className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No Category Found</p>
                    )}
                </div>
            </div>
        </>
    );
}

CategoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Category',
            href: categoryRoutes.index(),
        },
    ],
};
