import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cart } from '@/types/models';
import cartRoutes from '@/routes/cart';
import checkoutRoutes from '@/routes/checkout';
import { formatIDR } from '@/lib/utils';

type PageProps = {
    cart_count: number;
    cart_total: number;
    cart: Cart[];
};

export default function CartDropdown() {
    const { cart, cart_count, cart_total } = usePage<PageProps>().props;

    const removeItem = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        router.delete(cartRoutes.remove(id), {
            preserveScroll: true,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="relative shrink-0"
                >
                    <ShoppingCart className="size-4" />
                    {cart_count > 0 && (
                        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {cart_count}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>
                    My Cart ({cart_count} items)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {cart.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        Your cart is empty.
                    </div>
                ) : (
                    <>
                        <DropdownMenuGroup className="max-h-64 overflow-auto">
                            {cart.map((item: any) => (
                                <DropdownMenuItem
                                    key={item.id}
                                    className="flex cursor-default items-center justify-between p-3"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <div className="flex flex-col">
                                        <span className="w-40 truncate text-sm font-semibold">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {item.quantity} x{' '}
                                            {formatIDR(item.price)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold">
                                            {formatIDR(
                                                item.quantity * item.price,
                                            )}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                                            onClick={(e) =>
                                                removeItem(e, item.id)
                                            }
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <div className="flex items-center justify-between p-3 font-bold">
                            <span>Total:</span>
                            <span>{formatIDR(cart_total)}</span>
                        </div>
                        <div className="p-2">
                            <Button asChild className="w-full">
                                <Link href={checkoutRoutes.index()}>
                                    View Cart & Checkout
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
