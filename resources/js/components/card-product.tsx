import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

export default function CardProduct() {
    return (
        <div className="flex w-full items-center justify-center bg-background p-8">
            <Card className="group/card w-80 gap-0 overflow-hidden rounded-2xl p-0!">
                {/* ── Image zone ── */}
                <div className="relative h-80 overflow-hidden">
                    <img
                        src="https://images.shadcnspace.com/assets/card/running-shoe-3d.png"
                        className="object-contain px-8 py-6 drop-shadow-2xl transition-transform duration-500 ease-out group-hover/card:scale-105"
                        alt="Nike Air Max Pulse"
                    />
                </div>

                {/* Info zone */}
                <CardContent className="space-y-1.5 px-4 pt-4 pb-4">
                    {/* Brand + name */}
                    <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-foreground">
                            Nike
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                            Air Max Pulse Running Shoes
                        </p>
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-500">
                            ↓21%
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                            $150
                        </span>
                        <span className="text-base font-bold text-foreground">
                            $119
                        </span>
                    </div>
                </CardContent>

                {/* Action zone — always visible */}
                <CardFooter className="gap-2 border-t-0 bg-transparent px-4 pb-6">
                    {/* Buy Now — button-17 ripple style */}
                    <Button className="group/btn relative flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary text-base font-semibold transition-all">
                        <span className="absolute top-full left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-700 ease-in-out group-hover/btn:scale-[20] dark:bg-gray-950" />
                        <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-gray-950 dark:group-hover/btn:text-white">
                            Buy Now
                        </span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
