import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import categoryRoutes from '@/routes/category';
import { Category } from '@/types/models';
import { Form, Head, usePage } from '@inertiajs/react';

type PageProps = {
    data: Category | undefined;
};

export default function CategoryForm() {
    const { data } = usePage<PageProps>().props;

    return (
        <>
            <Head title={data ? 'Edit Category' : 'Create Category'} />
            <div className="px-4 py-6">
                <h1 className="sr-only">
                    {data ? 'Edit Category' : 'Create Category'}
                </h1>

                <Heading title={data ? 'Edit Category' : 'Create Category'} />
                <Form
                    {...(data
                        ? CategoryController.update.form(data.id)
                        : CategoryController.store.form())}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={data?.name ?? ''}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Category name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

CategoryForm.layout = {
    breadcrumbs: [
        {
            title: 'Category',
            href: categoryRoutes.index(),
        },
        {
            title: 'Form',
            href: categoryRoutes.index(),
        },
    ],
};
