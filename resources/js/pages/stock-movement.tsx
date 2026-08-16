import { Head, usePage } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, PackageSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type StockMovement = {
    id: number;
    date: string;
    product_name: string;
    type: 'in' | 'out';
    quantity: number;
    notes: string;
};

type PageProps = {
    movements: StockMovement[];
};

export default function StockMovementIndex() {
    const { movements } = usePage<PageProps>().props;

    const renderTypeBadge = (type: string) => {
        if (type === 'in') {
            return (
                <Badge className="flex w-16 justify-center bg-emerald-500 text-white hover:bg-emerald-600">
                    <ArrowDownRight className="mr-1 size-3" /> IN
                </Badge>
            );
        }
        return (
            <Badge variant="destructive" className="flex w-16 justify-center">
                <ArrowUpRight className="mr-1 size-3" /> OUT
            </Badge>
        );
    };

    return (
        <>
            <Head title="Stock Movements" />

            <div className="space-y-6 px-4 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <PackageSearch className="size-6" /> Stock Movements
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Track product inventory changes, incoming stocks,
                            and order deductions.
                        </p>
                    </div>
                </div>

                {/* Tabel Scrollable */}
                <Card className="overflow-hidden border shadow-sm">
                    <CardHeader>
                        <CardTitle>Movement History</CardTitle>
                        <CardDescription>
                            All inventory activities sorted by the latest.
                        </CardDescription>
                    </CardHeader>

                    {/* Container tabel max 70% viewport */}
                    <CardContent className="relative max-h-[70vh] overflow-y-auto p-0">
                        <Table>
                            {/* Sticky Header */}
                            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                <TableRow>
                                    <TableHead className="w-[200px] pl-6">
                                        Date
                                    </TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="w-[100px] text-center">
                                        Type
                                    </TableHead>
                                    <TableHead className="w-[100px] text-center">
                                        Qty
                                    </TableHead>
                                    <TableHead className="pr-6">
                                        Notes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {movements.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No stock movements found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    movements.map((mv) => (
                                        <TableRow key={mv.id}>
                                            <TableCell className="pl-6 text-sm text-muted-foreground">
                                                {mv.date}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {mv.product_name}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {renderTypeBadge(mv.type)}
                                            </TableCell>
                                            <TableCell className="text-center font-bold">
                                                {mv.type === 'in' ? '+' : '-'}
                                                {mv.quantity}
                                            </TableCell>
                                            <TableCell className="pr-6 text-sm text-muted-foreground">
                                                {mv.notes}
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
