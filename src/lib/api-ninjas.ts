const API_NINJAS_KEY = process.env.API_NINJAS_KEY;

interface ApiNinjaQuote {
  quote: string;
  author: string;
  category: string;
}

export async function fetchQuotesFromApiNinjas(category?: string): Promise<ApiNinjaQuote[]> {
  if (!API_NINJAS_KEY) {
    console.warn('No API Ninjas key configured');
    return [];
  }

  try {
    const url = new URL('https://api.api-ninjas.com/v1/quotes');
    if (category) {
      url.searchParams.set('category', category);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': API_NINJAS_KEY,
      },
    });

    if (!response.ok) {
      console.error('API Ninjas error:', response.status);
      return [];
    }

    const data: ApiNinjaQuote[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quotes from API Ninjas:', error);
    return [];
  }
}

// Categories that work well for a notebook app
export const QUOTE_CATEGORIES = [
  'inspirational',
  'education',
  'learning',
  'success',
  'knowledge',
  'wisdom',
];
