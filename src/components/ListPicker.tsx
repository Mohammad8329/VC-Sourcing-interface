'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Check, ListPlus, Plus, BookmarkCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function ListPicker({ companyId, trigger }: { companyId: string, trigger?: React.ReactNode }) {
    const { lists, createList, addToList, removeFromList } = useAppStore();
    const [newListName, setNewListName] = useState('');

    const isSaved = lists.some((list) => list.companyIds.includes(companyId));

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        createList(newListName.trim());
        setNewListName('');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "gap-2 shrink-0",
                            isSaved && "border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 dark:border-green-500 dark:text-green-400 dark:bg-green-950/30 dark:hover:bg-green-900/40"
                        )}
                    >
                        {isSaved ? <BookmarkCheck size={16} /> : <ListPlus size={16} />}
                        {isSaved ? "Saved" : "Save to List"}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-3">
                    <h4 className="font-medium text-sm">Save to List</h4>

                    <div className="space-y-1 max-h-48 overflow-y-auto">
                        {lists.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2 text-center">No lists created yet.</p>
                        ) : (
                            lists.map((list) => {
                                const isAdded = list.companyIds.includes(companyId);
                                return (
                                    <button
                                        key={list.id}
                                        onClick={() => isAdded ? removeFromList(list.id, companyId) : addToList(list.id, companyId)}
                                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors text-left"
                                    >
                                        <span className="truncate pr-2">{list.name}</span>
                                        {isAdded && <Check size={14} className="text-primary shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <form onSubmit={handleCreate} className="pt-2 border-t mt-2 flex gap-2">
                        <Input
                            placeholder="New list name..."
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="h-8 text-xs"
                        />
                        <Button type="submit" size="icon" className="h-8 w-8 shrink-0" disabled={!newListName.trim()}>
                            <Plus size={14} />
                        </Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    );
}
