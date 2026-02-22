'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ListPlus, BookmarkCheck, Bookmark, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListPicker } from '@/components/ListPicker';
import { useAppStore } from '@/store/useAppStore';

interface CompanyTableProps {
    data: Company[];
}

type SortField = 'name' | 'stage' | 'employees' | 'founded' | 'totalFunding';

export function CompanyTable({ data }: CompanyTableProps) {
    const router = useRouter();
    const lists = useAppStore((state) => state.lists);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDesc, setSortDesc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDesc(!sortDesc);
        } else {
            setSortField(field);
            setSortDesc(false);
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let comparison = 0;
        if (a[sortField]! > b[sortField]!) comparison = 1;
        if (a[sortField]! < b[sortField]!) comparison = -1;
        return sortDesc ? -comparison : comparison;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                No companies found matching your filters.
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full space-y-4">
            <div className="rounded-md border bg-card w-full">
                <Table className="w-full table-fixed">
                    <TableHeader className="sticky top-0 bg-secondary/50 backdrop-blur z-10 border-b shadow-sm">
                        <TableRow>
                            <TableHead className="w-[40%] min-w-[250px]">
                                <Button variant="ghost" onClick={() => handleSort('name')} className="-ml-3 h-10 text-base data-[state=open]:bg-accent">
                                    Company
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[15%]">Sector</TableHead>
                            <TableHead className="w-[15%]">
                                <Button variant="ghost" onClick={() => handleSort('stage')} className="-ml-3 h-10 text-base">
                                    Stage
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[15%] hidden md:table-cell">
                                <Button variant="ghost" onClick={() => handleSort('totalFunding')} className="-ml-3 h-10 text-base">
                                    Funding
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[15%] hidden lg:table-cell">
                                <Button variant="ghost" onClick={() => handleSort('employees')} className="-ml-3 h-10 text-base">
                                    Employees
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[10%] text-right pr-6">Save</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((company) => (
                            <TableRow
                                key={company.id}
                                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => router.push(`/companies/${company.id}`)}
                            >
                                <TableCell className="truncate py-3">
                                    <div className="font-medium text-primary text-base truncate">{company.name}</div>
                                    <div className="text-sm text-muted-foreground opacity-60 mt-1 truncate">
                                        {company.description}
                                    </div>
                                </TableCell>
                                <TableCell className="truncate">
                                    <Badge variant="secondary" className="font-normal truncate">{company.sector}</Badge>
                                </TableCell>
                                <TableCell className="truncate">
                                    <Badge variant="outline" className="font-medium truncate">{company.stage}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground truncate hidden md:table-cell">{company.totalFunding || '-'}</TableCell>
                                <TableCell className="text-muted-foreground truncate hidden lg:table-cell">{company.employees}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ListPicker
                                            companyId={company.id}
                                            trigger={
                                                lists.some((l) => l.companyIds.includes(company.id)) ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-500 dark:bg-green-950/30 dark:hover:bg-green-900/40 dark:hover:text-green-400"
                                                        title="Saved to list"
                                                    >
                                                        <BookmarkCheck size={16} />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        title="Save to list"
                                                    >
                                                        <Bookmark size={16} />
                                                    </Button>
                                                )
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-medium">{sortedData.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="text-sm font-medium px-2">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
