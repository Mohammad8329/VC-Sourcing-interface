export interface Signal {
  type: string;
  label: string;
  detail: string;
}

export interface Source {
  url: string;
  scrapedAt: string;
}

export interface EnrichmentResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: Signal[];
  sources: Source[];
  enrichedAt: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  location: string;
  founded: number;
  employees: string; // e.g. "11-50"
  description: string;
  tags: string[];
  totalFunding?: string;
  lastRoundDate?: string;
  enrichment?: EnrichmentResult | null;
}
