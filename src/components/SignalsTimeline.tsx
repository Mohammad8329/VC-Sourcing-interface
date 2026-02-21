'use client';

import { Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Users, Rocket, TrendingUp } from 'lucide-react';

export function SignalsTimeline({ company }: { company: Company }) {
    // Mock timeline events for visual flair
    const events = [
        {
            id: 1,
            date: '2 Days Ago',
            type: 'news',
            title: 'Mentioned in TechCrunch',
            description: `Featured in "Top ${company.sector} Startups to Watch in 2026"`,
            icon: <Newspaper size={16} className="text-blue-500" />
        },
        {
            id: 2,
            date: '1 Week Ago',
            type: 'hiring',
            title: 'Job Posting Spike',
            description: 'Added 12 new engineering roles to their careers page',
            icon: <Users size={16} className="text-emerald-500" />
        },
        {
            id: 3,
            date: '1 Month Ago',
            type: 'product',
            title: 'Major Product Launch',
            description: 'Announced v2.0 with GenAI capabilities',
            icon: <Rocket size={16} className="text-purple-500" />
        },
        {
            id: 4,
            date: company.lastRoundDate ? new Date(company.lastRoundDate).toLocaleDateString() : '3 Months Ago',
            type: 'funding',
            title: `${company.stage} Round`,
            description: `Raised ${company.totalFunding || 'undisclosed amount'} led by top-tier funds`,
            icon: <TrendingUp size={16} className="text-amber-500" />
        },
    ];

    return (
        <div className="relative border-l ml-3 space-y-8 pb-4 border-muted">
            {events.map((event) => (
                <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border shadow-sm">
                        {event.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground">{event.date}</span>
                        <div className="font-semibold text-sm text-foreground">{event.title}</div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
