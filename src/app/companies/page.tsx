'use client';

import { useState, useMemo } from 'react';
import { CompanyTable } from '@/components/CompanyTable';
import { FilterPanel } from '@/components/FilterPanel';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import companiesData from '@/data/companies.json';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export default function DiscoveryPage() {
    // Filter States
    const search = useAppStore((state) => state.globalSearch);
    const setSearch = useAppStore((state) => state.setGlobalSearch);

    // Filter States
    const filterSectors = useAppStore((state) => state.filterSectors);
    const filterStages = useAppStore((state) => state.filterStages);

    const addSavedSearch = useAppStore((state) => state.addSavedSearch);

    const filteredCompanies = useMemo(() => {
        return (companiesData as Company[]).filter((company) => {
            const matchSearch = search
                ? company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.description.toLowerCase().includes(search.toLowerCase()) ||
                company.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
                : true;

            const matchSector = filterSectors.length > 0 ? filterSectors.includes(company.sector) : true;
            const matchStage = filterStages.length > 0 ? filterStages.includes(company.stage) : true;

            return matchSearch && matchSector && matchStage;
        });
    }, [search, filterSectors, filterStages]);

    const handleSaveSearch = () => {
        if (!search && filterSectors.length === 0 && filterStages.length === 0) {
            toast.error('Apply some filters to save a search');
            return;
        }

        let defaultName = `Search on ${new Date().toLocaleDateString()}`;
        if (search) {
            defaultName = search;
        } else if (filterSectors.length > 0) {
            defaultName = filterSectors.join(', ');
        } else if (filterStages.length > 0) {
            defaultName = filterStages.join(', ');
        }

        const name = prompt('Name for this saved search:', defaultName);
        if (name) {
            addSavedSearch({ name, filters: { search, sectors: filterSectors, stages: filterStages } });
            toast.success('Search saved successfully!');
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-muted/10">
            {/* Top Navigation Bar */}
            <header className="h-[72px] bg-primary px-6 text-primary-foreground border-b border-primary/20 flex items-center justify-between sticky top-0 z-20">
                <div className="flex-1 max-w-xl relative text-slate-900">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10" />
                    <Input
                        placeholder="Search companies, descriptions, or tags..."
                        className="pl-9 pr-9 h-10 bg-white border-transparent text-slate-900 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm dark:bg-white dark:text-slate-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <FilterPanel />
                    <Button
                        variant="outline"
                        onClick={handleSaveSearch}
                        className="h-10 w-[140px] bg-accent border-transparent text-black hover:text-[#E5E5E5] hover:bg-accent/90 shadow-sm"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Search
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="p-6 flex-1">
                <CompanyTable data={filteredCompanies} />
            </div>
        </div>
    );
}
