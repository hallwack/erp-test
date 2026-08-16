import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type OrderProps = {
    order_number: string;
    customer_name: string;
    total: string | number;
    status: string;
    payment_status:
        'paid' | 'unpaid' | 'expired' | 'failed' | 'cancelled' | 'pending';
};

export default function CheckoutStatus({ order }: { order: OrderProps }) {
    const getStatusUI = () => {
        switch (order.payment_status) {
            case 'paid':
                return {
                    icon: (
                        <CheckCircle2 className="mx-auto size-20 text-green-500" />
                    ),
                    title: 'Payment Successful!',
                    description:
                        'Thank you for your purchase. Your order is being processed.',
                    bgColor: 'bg-green-50 dark:bg-green-950/30',
                    borderColor: 'border-green-200 dark:border-green-900',
                };
            case 'unpaid':
            case 'pending':
                return {
                    icon: <Clock className="mx-auto size-20 text-yellow-500" />,
                    title: 'Waiting for Payment',
                    description:
                        'Please complete your payment using the link provided by Xendit.',
                    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
                    borderColor: 'border-yellow-200 dark:border-yellow-900',
                };
            default: // expired, cancelled, failed
                return {
                    icon: <XCircle className="mx-auto size-20 text-red-500" />,
                    title: 'Payment Failed or Expired',
                    description:
                        'Your payment session has ended or the transaction was cancelled.',
                    bgColor: 'bg-red-50 dark:bg-red-950/30',
                    borderColor: 'border-red-200 dark:border-red-900',
                };
        }
    };

    const ui = getStatusUI();

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(order.total));

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
            <Head title="Payment Status" />

            <Card
                className={`w-full max-w-md text-center shadow-lg ${ui.borderColor} border-2`}
            >
                <CardHeader className={`${ui.bgColor} rounded-t-lg pt-10 pb-8`}>
                    {ui.icon}
                    <CardTitle className="mt-6 text-2xl font-bold tracking-tight">
                        {ui.title}
                    </CardTitle>
                    <p className="mt-2 px-4 text-sm text-muted-foreground">
                        {ui.description}
                    </p>
                </CardHeader>

                <CardContent className="pt-6 text-left">
                    <h3 className="mb-4 border-b pb-2 font-semibold text-foreground">
                        Order Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Order Number
                            </span>
                            <span className="font-medium">
                                {order.order_number}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Customer Name
                            </span>
                            <span className="font-medium">
                                {order.customer_name}
                            </span>
                        </div>
                        <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
                            <span>Total Amount</span>
                            <span>{formattedTotal}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 px-6 pb-8">
                    {order.payment_status === 'paid' ? (
                        <Button className="w-full" asChild>
                            <Link href="/">
                                Go to Home{' '}
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    ) : order.payment_status === 'unpaid' ? (
                        <Button
                            className="w-full"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Status
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            variant="destructive"
                            asChild
                        >
                            <Link href="/">Try Ordering Again</Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
