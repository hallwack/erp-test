import { Head, Link, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
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

type OrderListItem = {
    id: number;
    order_number: string;
    customer_name: string;
    date: string;
    total: number;
    payment_status: string;
};

export default function OrderIndex() {
    const { orders } = usePage<{ orders: OrderListItem[] }>().props;

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
            <Head title="Order List" />

            <div className="space-y-6 px-4 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Orders
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your store transactions and view payment
                            statuses.
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden border shadow-sm">
                    <CardHeader>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription>
                            Scroll down to view the complete history.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative max-h-[70vh] overflow-y-auto p-0">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                <TableRow>
                                    <TableHead className="pl-6">
                                        Order #
                                    </TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="pr-6 text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="pl-6 font-medium">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                {order.customer_name}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatIDR(order.total)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`text-[10px] uppercase ${getBadgeColor(order.payment_status)}`}
                                                >
                                                    {order.payment_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={orderRoutes.show(
                                                            order.id,
                                                        )}
                                                    >
                                                        <Eye className="mr-2 size-4" />{' '}
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrderIndex.layout = {
    breadcrumbs: [
        {
            title: 'Order',
            href: orderRoutes.index(),
        },
    ],
};
