import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatIDR } from '@/lib/utils';
import orderRoutes from '@/routes/order';

type Transaction = {
    id: number;
    order_number: string;
    date: string;
    total: number;
    status: string;
};

type DashboardProps = {
    totalRevenue: number;
    totalOrders: number;
    lowStockCount: number;
    recentTransactions: Transaction[];
};

export default function Dashboard() {
    const { totalRevenue, totalOrders, lowStockCount, recentTransactions } =
        usePage<DashboardProps>().props;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Head title="Dashboard" />

            <div className="mb-6 flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Finance / Reporting
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatIDR(totalRevenue)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Successful transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                            {lowStockCount}{' '}
                            <span className="text-sm font-normal text-muted-foreground">
                                produk
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Requires immediate restock
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No recent transactions available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentTransactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={orderRoutes.show(
                                                        tx.id,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {tx.order_number}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{tx.date}</TableCell>
                                            <TableCell>
                                                {formatIDR(tx.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        tx.status === 'paid'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        tx.status === 'paid'
                                                            ? 'bg-green-500 hover:bg-green-600'
                                                            : tx.status ===
                                                                'unpaid'
                                                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                              : 'bg-red-500 hover:bg-red-600'
                                                    }
                                                >
                                                    {tx.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        tx.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
