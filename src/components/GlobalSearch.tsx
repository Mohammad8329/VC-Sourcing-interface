'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import companies from '@/data/companies.json';
import { Company } from '@/types';

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (companyId: string) => {
        setOpen(false);
        router.push(`/companies/${companyId}`);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a company name or keyword..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Companies">
                    {(companies as Company[]).map((company) => (
                        <CommandItem
                            key={company.id}
                            value={`${company.name} ${company.tags.join(' ')}`}
                            onSelect={() => handleSelect(company.id)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Building2 className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-semibold">{company.name}</span>
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                    {company.description}
                                </span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
