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
import { ArrowUpDown, ListPlus, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListPicker } from '@/components/ListPicker';

interface CompanyTableProps {
    data: Company[];
}

type SortField = 'name' | 'stage' | 'employees' | 'founded' | 'totalFunding';

export function CompanyTable({ data }: CompanyTableProps) {
    const router = useRouter();
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDesc, setSortDesc] = useState(false);

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

    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                No companies found matching your filters.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader className="sticky top-0 bg-secondary/50 backdrop-blur z-10 border-b">
                <TableRow>
                    <TableHead className="w-[300px]">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('name')} className="-ml-3 h-8 data-[state=open]:bg-accent">
                            Company
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('stage')} className="-ml-3 h-8">
                            Stage
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('totalFunding')} className="-ml-3 h-8">
                            Funding
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('employees')} className="-ml-3 h-8">
                            Employees
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((company) => (
                    <TableRow
                        key={company.id}
                        className="group cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/companies/${company.id}`)}
                    >
                        <TableCell>
                            <div className="font-medium text-primary">{company.name}</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {company.description}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="font-normal">{company.sector}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="font-medium">{company.stage}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{company.totalFunding || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{company.employees}</TableCell>
                        <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <div onClick={(e) => e.stopPropagation()}>
                                <ListPicker
                                    companyId={company.id}
                                    trigger={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            title="Save to list"
                                        >
                                            <ListPlus size={16} />
                                        </Button>
                                    }
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
