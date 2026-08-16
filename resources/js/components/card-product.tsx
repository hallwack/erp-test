import { router } from '@inertiajs/react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import cartRoutes from '@/routes/cart';
import { toast } from 'sonner';

export default function CardProduct({
    id,
    name,
    price,
}: {
    id: number;
    name: string;
    price: string;
}) {
    const handleAddToCart = () => {
        router.post(
            cartRoutes.add(id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Item added to cart!');
                    console.log('Item added to cart!');
                },
            },
        );
    };

    return (
        <div className="flex w-full items-center justify-center bg-background">
            <Card className="group/card w-80 gap-0 overflow-hidden rounded-2xl p-0!">
                <CardContent className="space-y-1.5 px-4 pt-4 pb-4">
                    <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-foreground">
                            {name}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-base font-bold text-foreground">
                            {price}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="gap-2 border-t-0 bg-transparent px-4 pb-6">
                    <Button onClick={handleAddToCart} className="w-full">
                        Buy Now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
