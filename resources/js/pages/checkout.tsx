import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import checkout from '@/routes/checkout';

export default function CheckoutIndex() {
    const { cart, cart_total } = usePage<any>().props;

    const { data, setData, processing, errors, submit } = useForm({
        customer_name: '',
    });

    const onSubmitCart = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(checkout.store());
    };

    if (cart.length === 0) {
        return (
            <div className="p-8 text-center">
                <p>Your cart is empty.</p>
                <Link
                    href="/"
                    className="mt-4 inline-block text-blue-500 underline"
                >
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
            <Head title="Checkout" />

            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
            </div>

            <form onSubmit={onSubmitCart} className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="customer_name">
                                    Customer Name (Optional)
                                </Label>
                                <Input
                                    id="customer_name"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData('customer_name', e.target.value)
                                    }
                                    placeholder="e.g. John Doe"
                                />
                                <InputError message={errors.customer_name} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-48 space-y-2 overflow-y-auto">
                                {cart.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.quantity}x {item.name}
                                        </span>
                                        <span>
                                            Rp. {item.quantity * item.price}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between border-t pt-4 font-bold">
                                <span>Total</span>
                                <span>Rp. {cart_total}</span>
                            </div>
                        </CardContent>
                        <CardContent>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
