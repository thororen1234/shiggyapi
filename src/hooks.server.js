import { scrapeImages } from '$lib/scraper.js';

scrapeImages().catch(e => console.error('Scraper failed:', e));
