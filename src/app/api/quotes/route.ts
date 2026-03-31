import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchQuotesFromApiNinjas, QUOTE_CATEGORIES } from '@/lib/api-ninjas';

// GET - Get a random quote from cache
export async function GET() {
  try {
    // Get total count
    const count = await prisma.quote.count();

    if (count === 0) {
      // No cached quotes, return a default
      return NextResponse.json({
        text: "The best time to start taking notes was yesterday. The second best time is now.",
        author: "Ancient Proverb",
      });
    }

    // Get random quote
    const skip = Math.floor(Math.random() * count);
    const quotes = await prisma.quote.findMany({
      take: 1,
      skip,
    });

    const quote = quotes[0];
    return NextResponse.json({
      text: quote.text,
      author: quote.author || 'Unknown',
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({
      text: "Knowledge is power.",
      author: "Francis Bacon",
    });
  }
}

// POST - Refresh quotes cache (fetch new quotes from API Ninjas)
export async function POST() {
  try {
    const newQuotes: { text: string; author: string | null }[] = [];

    // Fetch quotes from multiple categories
    for (const category of QUOTE_CATEGORIES) {
      const quotes = await fetchQuotesFromApiNinjas(category);
      for (const q of quotes) {
        newQuotes.push({
          text: q.quote,
          author: q.author || null,
        });
      }
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    if (newQuotes.length === 0) {
      return NextResponse.json(
        { error: 'No quotes fetched. Check API key.' },
        { status: 400 }
      );
    }

    // Add new quotes to database (skip duplicates)
    let added = 0;
    for (const quote of newQuotes) {
      const exists = await prisma.quote.findFirst({
        where: { text: quote.text },
      });

      if (!exists) {
        await prisma.quote.create({ data: quote });
        added++;
      }
    }

    const total = await prisma.quote.count();

    return NextResponse.json({
      success: true,
      added,
      total,
    });
  } catch (error) {
    console.error('Error refreshing quotes:', error);
    return NextResponse.json(
      { error: 'Failed to refresh quotes' },
      { status: 500 }
    );
  }
}
