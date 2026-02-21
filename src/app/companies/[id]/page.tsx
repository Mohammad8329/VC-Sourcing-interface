import companiesData from '@/data/companies.json';
import { Company } from '@/types';
import { notFound } from 'next/navigation';
import { CompanyProfile } from '@/components/CompanyProfile';
import { SignalsTimeline } from '@/components/SignalsTimeline';
import { NoteEditor } from '@/components/NoteEditor';
import { EnrichPanel } from '@/components/EnrichPanel';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const company = (companiesData as Company[]).find((c) => c.id === resolvedParams.id);

    if (!company) {
        notFound();
    }

    return (
        <div className="flex flex-col h-full bg-muted/10 p-6 overscroll-none">
            <div className="mb-4 flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-3">
                    <Link href="/companies">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Discovery
                    </Link>
                </Button>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Left Column: Overview & Notes */}
                <div className="flex w-2/3 flex-col gap-6 overflow-y-auto pr-2 pb-6">
                    <CompanyProfile company={company} />

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Analyst Notes</h2>
                        <NoteEditor companyId={company.id} />
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Timeline & Signals</h2>
                        <SignalsTimeline company={company} />
                    </div>
                </div>

                {/* Right Column: AI Enrichment */}
                <div className="w-1/3 flex flex-col min-h-0">
                    <EnrichPanel company={company} />
                </div>
            </div>
        </div>
    );
}
