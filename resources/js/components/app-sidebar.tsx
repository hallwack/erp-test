import { Link } from '@inertiajs/react';
import {
    BadgeDollarSign,
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Package,
    PackageSearch,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import categoryRoutes from '@/routes/category';
import productRoutes from '@/routes/product';
import orderRoutes from '@/routes/order';
import stockMovementRoutes from '@/routes/stock-movement';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const inventoryNavItems: NavItem[] = [
    {
        title: 'Category',
        href: categoryRoutes.index(),
        icon: PackageSearch,
    },
    {
        title: 'Product',
        href: productRoutes.index(),
        icon: Package,
    },
];

const financeNavItems: NavItem[] = [
    {
        title: 'Order',
        href: orderRoutes.index(),
        icon: BadgeDollarSign,
    },
    {
        title: 'Stock Movement',
        href: stockMovementRoutes.index(),
        icon: PackageSearch,    
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={inventoryNavItems} label="Inventory" />
                <NavMain items={financeNavItems} label="Finance" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
