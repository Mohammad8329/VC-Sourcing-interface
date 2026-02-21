'use client';

import { useState, useEffect } from 'react';
import { Company, EnrichmentResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCcw, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function EnrichPanel({ company }: { company: Company }) {
    const storageKey = `vc-enrich-${company.id}`;
    const [enrichment, setEnrichment] = useState<EnrichmentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setEnrichment(JSON.parse(saved));
            } catch (e) { }
        }
    }, [storageKey]);

    const handleEnrich = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId: company.id, websiteUrl: company.website }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to enrich company');
            }

            const data = await response.json();
            setEnrichment(data);
            localStorage.setItem(storageKey, JSON.stringify(data));
            toast.success('Live enrichment complete');
        } catch (err: any) {
            setError(err.message);
            toast.error('Enrichment failed', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <p className="text-xs text-muted-foreground animate-pulse flex items-center gap-2">
                        <Sparkles size={12} /> Scanning public pages with LLM...
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-4">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">Enrichment Failed</div>
                        <div className="text-xs text-muted-foreground mt-1">{error}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleEnrich}>
                        Try Again
                    </Button>
                </div>
            );
        }

        if (!enrichment) {
            return (
                <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">Live AI Enrichment</div>
                        <div className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                            Scrape and analyze public pages (About, Blog, Careers)
                        </div>
                    </div>
                    <Button size="sm" onClick={handleEnrich} className="w-full">
                        Enrich Now <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-primary" />
                        AI Summary
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                        {enrichment.summary}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {enrichment.keywords?.map(kw => (
                        <Badge key={kw} variant="outline" className="text-xs font-normal border-primary/20 bg-primary/5">
                            {kw}
                        </Badge>
                    ))}
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3">Key Capabilities</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {enrichment.whatTheyDo?.map((item, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {enrichment.signals && enrichment.signals.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Extracted Signals</h3>
                        <div className="space-y-3">
                            {enrichment.signals.map((signal, i) => (
                                <div key={i} className="bg-muted p-3 rounded-lg border">
                                    <div className="font-medium text-sm text-foreground">{signal.label}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{signal.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-muted">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sources scanned</h3>
                    <div className="space-y-2">
                        {enrichment.sources?.map((src, i) => (
                            <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <Globe size={12} className="group-hover:text-primary" />
                                <span className="flex-1 truncate">{new URL(src.url).pathname || src.url}</span>
                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">Enrichment Profile</h2>
                {enrichment && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {formatDistanceToNow(new Date(enrichment.enrichedAt))} ago
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleEnrich} disabled={loading}>
                            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
                        </Button>
                    </div>
                )}
            </div>
            <div className="p-6 flex-1 overflow-y-auto min-h-0">
                {renderContent()}
            </div>
        </div>
    );
}
