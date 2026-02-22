'use client';

import { useAppStore } from '@/store/useAppStore';
import companiesData from '@/data/companies.json';
import { Company } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Download, Plus, AlertCircle, ExternalLink } from 'lucide-react';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ListsPage() {
    const { lists, createList, deleteList, removeFromList } = useAppStore();
    const [newListName, setNewListName] = useState('');
    const [activeListId, setActiveListId] = useState<string | null>(lists.length > 0 ? lists[0].id : null);

    const activeList = lists.find(l => l.id === activeListId) || lists[0];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        createList(newListName.trim());
        setNewListName('');
        if (lists.length === 0) {
            // If it's the first list, we want it selected, but store updates asynchronously. 
            // User will just click it on next render.
        }
    };

    const exportCSV = (listInfo: typeof lists[0]) => {
        const listCompanies = listInfo.companyIds
            .map(id => (companiesData as Company[]).find(c => c.id === id))
            .filter(Boolean) as Company[];

        if (listCompanies.length === 0) return;

        const headers = ['Name', 'Website', 'Sector', 'Stage', 'Location', 'Founded', 'Employees', 'Total Funding'];
        const rows = listCompanies.map(c => [
            `"${c.name}"`,
            `"${c.website}"`,
            `"${c.sector}"`,
            `"${c.stage}"`,
            `"${c.location}"`,
            c.founded,
            `"${c.employees}"`,
            `"${c.totalFunding || ''}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${listInfo.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    };

    return (
        <div className="flex h-full p-6 gap-6 bg-muted/10">
            <div className="w-64 flex flex-col gap-4 border-r pr-6">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">My Lists</h2>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Manage your sourcing lists.</p>
                </div>

                <form onSubmit={handleCreate} className="flex gap-2">
                    <Input
                        placeholder="New list..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="h-9"
                    />
                    <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!newListName.trim()}>
                        <Plus size={16} />
                    </Button>
                </form>

                <div className="space-y-1 mt-4">
                    {lists.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">No lists created.</div>
                    ) : (
                        lists.map(list => (
                            <button
                                key={list.id}
                                onClick={() => setActiveListId(list.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeList?.id === list.id
                                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                <span className="truncate pr-2">{list.name}</span>
                                <Badge variant={activeList?.id === list.id ? "secondary" : "outline"} className="text-xs shrink-0">
                                    {list.companyIds.length}
                                </Badge>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full">
                {activeList ? (
                    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h3 className="text-xl font-semibold">{activeList.name}</h3>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Created {format(new Date(activeList.createdAt), 'MMM d, yyyy')} • {activeList.companyIds.length} companies
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportCSV(activeList)}
                                    disabled={activeList.companyIds.length === 0}
                                >
                                    <Download size={16} className="mr-2" /> Export CSV
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteList(activeList.id)}
                                >
                                    <Trash2 size={16} className="mr-2" /> Delete List
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-0">
                            {activeList.companyIds.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center h-full gap-3 text-muted-foreground">
                                    <AlertCircle size={32} className="opacity-20" />
                                    <p>This list is empty. Go to Discovery to add companies.</p>
                                    <Button variant="outline" size="sm" asChild className="mt-2">
                                        <Link href="/companies">Explore Companies</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {activeList.companyIds.map(id => {
                                        const company = (companiesData as Company[]).find(c => c.id === id);
                                        if (!company) return null;
                                        return (
                                            <div key={id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <Link href={`/companies/${company.id}`} className="font-semibold text-primary hover:underline flex items-center gap-2">
                                                            {company.name} <ExternalLink size={12} />
                                                        </Link>
                                                        <Badge variant="secondary" className="font-normal text-xs">{company.sector}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground opacity-60 line-clamp-1">{company.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span>{company.stage}</span>
                                                        <span>•</span>
                                                        <span>{company.location}</span>
                                                        <span>•</span>
                                                        <span>{company.employees} employees</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeFromList(activeList.id, id)}
                                                    title="Remove from list"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground border rounded-xl bg-card border-dashed">
                        Select or create a list to view its contents.
                    </div>
                )}
            </div>
        </div>
    );
}
