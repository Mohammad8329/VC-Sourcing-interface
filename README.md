# VC Intelligence Interface

A thesis-driven sourcing and enrichment interface tailored for venture capital analysts. Quickly discover targeted startups, apply deep segment filters, save them into lists, write notes, and enrich their profiles via real-time LLM scraping.

## 🚀 Features

- **Company Discovery**: Filter over 20 mock companies by Stage, Sector, Employee Count, and Location. Sort by metrics and search via fuzzy matching.
- **AI Enrichment**: Instantly scrapes a target company's public assets (homepage, about, carriers, blog) using Jina AI and extracts a structured intelligence report via Google API (`@google/genai`) inside a persistent panel.
- **Saved Searches**: Build complex queries to match a fund's investment thesis and save them for 1-click execution.
- **List Management**: Add prospective companies to designated sourcing lists, track them, and export to CSV for data-room ingestion.
- **Global `Cmd+K` Palette**: Instantly jump from any context directly to a company profile.
- **Analyst Notes**: Persistent note editor to jot red flags and thesis alignment metrics directly on the profile. 

## 🏗 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: Zustand with `localStorage` persistence
- **Extraction APIs**: Jina AI Reader API (public fallback) + Google API (`@google/genai`)
- **Language**: TypeScript

## 🔧 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file at the root of the project with your Google API key:
   ```env
   GEMINI_API_KEY="your-google-api-key"
   ```
   *(Note: Firecrawl was replaced with the free Jina AI `r.jina.ai` endpoint as it doesn't require an API key to scrape markdown representations of pages.)*

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔍 Note on AI Enrichment

The Live AI Enrichment uses a Next.js `/api/enrich` route. It takes the target company's URL, passes it through the Jina Reader API to get a cleanly extracted Markdown version of the website, then prompts the Google API to populate a rigid JSON shape for summary, signals, and keywords. 

### Deployment

This application is ready to deploy on Vercel out of the box. Ensure the `.env.local` values are copied over to the Vercel project's Environment Variables during setup.
