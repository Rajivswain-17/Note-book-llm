import { Firecrawl } from 'firecrawl';
import { ValidationError } from "../types/app-error.js";

export async function scrapeWebsite(url: string) {
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
        throw new ValidationError("Firecrawl is not configured on the server");
    }

    const client = new Firecrawl({ apiKey });

    let result;
    try {
        result = await client.scrape(url, {
            formats: ["markdown"],
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "";
        const code = (err as NodeJS.ErrnoException).code ?? "";
        if (code === "ETIMEDOUT" || code === "ECONNREFUSED" || code === "ENOTFOUND") {
            throw new ValidationError(
                "Could not reach the Firecrawl API. Check your internet connection or Firecrawl API key.",
            );
        }
        throw new ValidationError(
            `Failed to scrape URL: ${message || "Unknown error"}`
        );
    }

    const markdown = result.markdown?.trim();

    if (!markdown) {
        throw new ValidationError("Could not extract content from this URL");
    }

    return {
        markdown,
        title: result.metadata?.title,
        sourceUrl: result.metadata?.sourceURL ?? url,
    };
}