'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SavedSearchesPage() {
    const { savedSearches, removeSavedSearch } = useAppStore();
    const router = useRouter();

    const handleRunSearch = (filters: any) => {
        // Ideally we would pass these via URL query params or another state approach
        // But since the scope is simple, we will just pass a message or URL params later
        // For now, we'll construct basic query string from active filters to show the mechanics
        const params = new URLSearchParams();
        if (filters.search) params.set('q', filters.search);
        if (filters.sectors?.length) params.set('sectors', filters.sectors.join(','));
        if (filters.stages?.length) params.set('stages', filters.stages.join(','));

        router.push(`/companies?${params.toString()}`);
    };

    return (
        <div className="h-full p-6 bg-muted/10 overflow-y-auto w-full">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Saved Searches</h1>
                    <p className="text-muted-foreground mt-1">
                        Persisted search combinations and filter presets.
                    </p>
                </div>

                {savedSearches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-[400px] gap-4 bg-card rounded-xl border border-dashed">
                        <Search size={48} className="text-muted-foreground/30" />
                        <div>
                            <div className="font-semibold">No saved searches</div>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                Go to the Discovery page, apply your thesis filters, and click "Save Search" to create one.
                            </p>
                        </div>
                        <Button onClick={() => router.push('/companies')} variant="outline">
                            Back to Discovery
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedSearches.map((search) => {
                            const filterCount = (search.filters.sectors?.length || 0) + (search.filters.stages?.length || 0) + (search.filters.search ? 1 : 0);
                            return (
                                <Card key={search.id} className="flex flex-col">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center justify-between">
                                            <span className="truncate pr-4">{search.name}</span>
                                        </CardTitle>
                                        <div className="text-xs text-muted-foreground mt-1 font-medium">
                                            Saved {format(new Date(search.savedAt), 'MMM d, yyyy')}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-3 pb-4">
                                        {search.filters.search && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground mr-2">Query:</span>
                                                <span className="font-medium">"{search.filters.search}"</span>
                                            </div>
                                        )}
                                        {search.filters.sectors && search.filters.sectors.length > 0 && (
                                            <div>
                                                <span className="text-muted-foreground text-xs block mb-1.5 uppercase tracking-wider font-semibold">Sectors</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {search.filters.sectors.map((s: string) => (
                                                        <Badge variant="secondary" key={s} className="font-normal text-xs">{s}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {search.filters.stages && search.filters.stages.length > 0 && (
                                            <div>
                                                <span className="text-muted-foreground text-xs block mb-1.5 uppercase tracking-wider font-semibold">Stages</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {search.filters.stages.map((s: string) => (
                                                        <Badge variant="outline" key={s} className="font-normal text-xs">{s}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {filterCount === 0 && (
                                            <div className="text-sm text-muted-foreground italic">No filters applied (All companies)</div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-0 flex gap-2 border-t p-4 mt-auto bg-muted/20">
                                        <Button variant="default" className="flex-1" onClick={() => handleRunSearch(search.filters)}>
                                            <Play size={16} className="mr-2" /> Run Search
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => removeSavedSearch(search.id)}>
                                            <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
