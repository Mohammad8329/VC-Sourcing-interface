'use client';

import { useState, useMemo } from 'react';
import { CompanyTable } from '@/components/CompanyTable';
import { FilterPanel } from '@/components/FilterPanel';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import companiesData from '@/data/companies.json';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export default function DiscoveryPage() {
    const [search, setSearch] = useState('');

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
        const name = prompt('Name for this saved search:', `Search on ${new Date().toLocaleDateString()}`);
        if (name) {
            addSavedSearch({ name, filters: { search, sectors: filterSectors, stages: filterStages } });
            toast.success('Search saved successfully!');
        }
    };

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col min-w-0 bg-muted/10 p-6 gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search companies, descriptions, or tags..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterPanel />
                        <Button variant="outline" onClick={handleSaveSearch}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Search
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto rounded-lg border bg-card">
                    <CompanyTable data={filteredCompanies} />
                </div>
            </div>
        </div>
    );
}
