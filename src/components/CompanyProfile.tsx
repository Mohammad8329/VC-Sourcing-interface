'use client';

import { Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Users, Calendar, Banknote } from 'lucide-react';
import { ListPicker } from '@/components/ListPicker';

export function CompanyProfile({ company }: { company: Company }) {
    // Try to generate a clean domain for the fallback logo
    const domain = company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    const logoUrl = `https://logo.clearbit.com/${domain}`;

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 border-b pb-6 w-full">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-white shadow-sm overflow-hidden p-2 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt={`${company.name} logo`}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&size=128`;
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between w-full">
                            <h1 className="text-2xl font-bold tracking-tight text-primary">
                                {company.name}
                            </h1>
                            <div className="flex gap-2">
                                <ListPicker companyId={company.id} />
                                <Button size="sm" variant="outline" className="h-8 gap-1.5 font-medium" asChild>
                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                        Website <ExternalLink size={14} />
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {company.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-muted-foreground whitespace-pre-wrap">
                {company.description}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 border bg-muted/40 rounded-lg p-4">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Banknote size={14} /> Stage
                    </div>
                    <div className="font-semibold text-sm">{company.stage}</div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Users size={14} /> Employees
                    </div>
                    <div className="font-semibold text-sm">{company.employees}</div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <MapPin size={14} /> Location
                    </div>
                    <div className="font-semibold text-sm">{company.location}</div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Calendar size={14} /> Founded
                    </div>
                    <div className="font-semibold text-sm">{company.founded}</div>
                </div>
            </div>
        </div>
    );
}
