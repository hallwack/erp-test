import { dashboard, login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import CardProduct from '@/components/card-product';
import { Product } from '@/types/models';
import { Auth } from '@/types';
import CartDropdown from '@/components/cart-dropdown';

type PageProps = {
    products: Product[];
    auth: Auth;
    cart_count: number;
    cart_total: number;
};

export default function Home() {
    const { auth, products } = usePage<PageProps>().props;

    return (
        <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
            <header className="sticky top-0 z-50 mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                <nav className="flex items-center justify-end gap-4">
                    <CartDropdown />

                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <div className="grid w-full max-w-5xl grid-cols-3 gap-6 opacity-100 transition-opacity duration-750 starting:opacity-0">
                {products.map((product) => (
                    <CardProduct
                        id={product.id}
                        key={product.id}
                        name={product.name}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}
