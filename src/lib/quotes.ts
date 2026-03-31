// Fallback quotes when API/database unavailable
export const fallbackQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

// For client-side: returns a random fallback quote synchronously
export function getRandomQuote() {
  return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

// For server-side: fetches from API (database cache)
export async function fetchRandomQuote(): Promise<{ text: string; author: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/quotes`, {
      cache: 'no-store',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
  }

  return getRandomQuote();
}
