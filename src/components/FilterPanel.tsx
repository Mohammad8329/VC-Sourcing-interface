'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, ChevronsUpDown, FilterX } from 'lucide-react';
import companiesData from '@/data/companies.json';
import { Company } from '@/types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';

export function FilterPanel() {
    const filterSectors = useAppStore((state) => state.filterSectors);
    const setFilterSectors = useAppStore((state) => state.setFilterSectors);
    const filterStages = useAppStore((state) => state.filterStages);
    const setFilterStages = useAppStore((state) => state.setFilterStages);

    const [openSector, setOpenSector] = useState(false);
    const [openStage, setOpenStage] = useState(false);

    const sectors = useMemo(() => {
        const list = new Set((companiesData as Company[]).map((c) => c.sector));
        return Array.from(list).sort();
    }, []);

    const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

    const toggleSector = (sector: string) => {
        if (filterSectors.includes(sector)) {
            setFilterSectors(filterSectors.filter((s) => s !== sector));
        } else {
            setFilterSectors([...filterSectors, sector]);
        }
    };

    const toggleStage = (stage: string) => {
        if (filterStages.includes(stage)) {
            setFilterStages(filterStages.filter((s) => s !== stage));
        } else {
            setFilterStages([...filterStages, stage]);
        }
    };

    const clearFilters = () => {
        setFilterSectors([]);
        setFilterStages([]);
    };

    const hasFilters = filterSectors.length > 0 || filterStages.length > 0;

    return (
        <div className="flex items-center gap-2">
            {/* Stage Filter */}
            <Popover open={openStage} onOpenChange={setOpenStage}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 min-w-[140px] bg-white border-transparent text-slate-900 hover:bg-slate-200 hover:text-slate-900 shadow-sm border-dashed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                        Funding Stage
                        {filterStages.length > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                    {filterStages.length}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {filterStages.length > 2 ? (
                                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                            {filterStages.length} selected
                                        </Badge>
                                    ) : (
                                        filterStages.map((stage) => (
                                            <Badge variant="secondary" key={stage} className="rounded-sm px-1 font-normal">
                                                {stage}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search stage..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {stages.map((stage) => {
                                    const isSelected = filterStages.includes(stage);
                                    return (
                                        <CommandItem
                                            key={stage}
                                            onSelect={() => toggleStage(stage)}
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <Check className={cn("h-4 w-4")} />
                                            </div>
                                            <span>{stage}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Sector Filter */}
            <Popover open={openSector} onOpenChange={setOpenSector}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 min-w-[140px] bg-white border-transparent text-slate-900 hover:bg-slate-200 hover:text-slate-900 shadow-sm border-dashed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                        Sector
                        {filterSectors.length > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                    {filterSectors.length}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {filterSectors.length > 2 ? (
                                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                            {filterSectors.length} selected
                                        </Badge>
                                    ) : (
                                        filterSectors.map((sector) => (
                                            <Badge variant="secondary" key={sector} className="rounded-sm px-1 font-normal">
                                                {sector}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search sector..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {sectors.map((sector) => {
                                    const isSelected = filterSectors.includes(sector);
                                    return (
                                        <CommandItem
                                            key={sector}
                                            onSelect={() => toggleSector(sector)}
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <Check className={cn("h-4 w-4")} />
                                            </div>
                                            <span>{sector}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="ghost" onClick={clearFilters} className="h-10 px-2 lg:px-3 text-white hover:bg-white hover:text-slate-900 dark:text-white dark:hover:bg-white dark:hover:text-slate-900">
                    Reset
                    <FilterX className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
