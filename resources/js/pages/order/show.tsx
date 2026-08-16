import { Head, usePage } from '@inertiajs/react';
import { CreditCard, Package, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import orderRoutes from '@/routes/order';
import { formatIDR } from '@/lib/utils';

type OrderDetails = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
};

type OrderData = {
    id: number;
    order_number: string;
    customer_name: string;
    subtotal: number;
    tax: number;
    total: number;
    payment_status: string;
    payment_method: string;
    date: string;
    orderDetails: OrderDetails[];
    payment: {
        gateway: string;
        paid_at: string | null;
    } | null;
};

export default function OrderShow() {
    const { order } = usePage<{ order: OrderData }>().props;

    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500 hover:bg-green-600';
            case 'unpaid':
                return 'bg-yellow-500 hover:bg-yellow-600 text-white';
            case 'expired':
            case 'cancelled':
            case 'failed':
                return 'bg-red-500 hover:bg-red-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6 px-4 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Order {order.order_number}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {order.date}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Badge
                            className={`px-3 py-1 text-sm uppercase ${getBadgeColor(order.payment_status)}`}
                        >
                            {order.payment_status}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="size-5" /> Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead className="text-right">
                                                Price
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Qty
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Subtotal
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.orderDetails.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {item.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatIDR(item.price)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatIDR(item.subtotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Separator className="my-6" />

                                <div className="ml-auto flex w-full max-w-sm flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span>{formatIDR(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Tax
                                        </span>
                                        <span>{formatIDR(order.tax)}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-base font-bold">
                                        <span>Total</span>
                                        <span>{formatIDR(order.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="size-4" /> Customer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <p className="font-medium">
                                    {order.customer_name}
                                </p>
                                <p className="mt-1 text-muted-foreground">
                                    Walk-in / POS Customer
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="size-4" /> Payment
                                    Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">
                                        Payment Method
                                    </p>
                                    <p className="font-medium capitalize">
                                        {order.payment_method === '-'
                                            ? 'Waiting...'
                                            : order.payment_method}
                                    </p>
                                </div>

                                {order.payment && (
                                    <div>
                                        <p className="text-muted-foreground">
                                            Gateway
                                        </p>
                                        <p className="font-medium capitalize">
                                            {order.payment.gateway}
                                        </p>
                                    </div>
                                )}

                                {order.payment?.paid_at && (
                                    <div>
                                        <p className="text-muted-foreground">
                                            Paid At
                                        </p>
                                        <p className="font-medium">
                                            {order.payment.paid_at}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = {
    breadcrumbs: [
        {
            title: 'Order',
            href: orderRoutes.index(),
        },
        {
            title: 'Details',
            href: orderRoutes.index(),
        },
    ],
};
