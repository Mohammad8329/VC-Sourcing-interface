'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Bookmark, List, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const links = [
        { href: '/companies', label: 'Discovery', icon: <Users size={20} /> },
        { href: '/lists', label: 'My Lists', icon: <List size={20} /> },
        { href: '/saved', label: 'Saved Searches', icon: <Bookmark size={20} /> },
    ];

    return (
        <div
            className={cn(
                "flex flex-col border-r bg-muted/20 transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-[72px] items-center justify-between border-b px-4 shrink-0">
                <Link href="/companies" className="flex items-center gap-2 font-semibold">
                    <Target className="text-primary" size={24} />
                    {!collapsed && <span>VC Intelligence</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
            </div>

            <nav className="flex-1 space-y-2 p-2 mt-4 overflow-y-auto">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith(link.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                            collapsed && "justify-center px-0"
                        )}
                        title={collapsed ? link.label : undefined}
                    >
                        {link.icon}
                        {!collapsed && link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                {!collapsed ? (
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium mr-1">Ctrl K</span> to search globally
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground text-center" title="Ctrl K to search">Ctrl K</div>
                )}
            </div>
        </div>
    );
}
