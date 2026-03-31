export const motivationalQuotes = [
  { text: "The only way to do great work is to love what you do... and maybe a little caffeine.", author: "Steve Jobs (probably)" },
  { text: "I have not failed. I've just found 10,000 ways that won't work. But hey, at least I'm consistent!", author: "Thomas Edison" },
  { text: "Believe you can and you're halfway there. The other half? That's the hard part.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal. But my coffee running out? Now that's concerning.", author: "Winston Churchill (adapted)" },
  { text: "The future belongs to those who believe in the beauty of their dreams... and good note-taking.", author: "Eleanor Roosevelt" },
  { text: "Your time is limited, so don't waste it reading fortune cookies. Wait...", author: "Irony" },
  { text: "In the middle of difficulty lies opportunity... and probably your lost pen.", author: "Albert Einstein" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now. The third best? After this nap.", author: "Chinese Proverb (extended)" },
  { text: "It does not matter how slowly you go as long as you do not stop... unless it's lunch break.", author: "Confucius" },
  { text: "Education is the most powerful weapon. Right after a sharp pencil.", author: "Nelson Mandela (adjusted)" },
  { text: "The only thing standing between you and your goal is the BS story you keep telling yourself. Also, procrastination.", author: "Jordan Belfort" },
  { text: "Life is 10% what happens to you and 90% how you react to it. The remaining 0%? Math errors.", author: "Charles R. Swindoll" },
  { text: "Don't watch the clock; do what it does. Keep going. Unless it stops, then get new batteries.", author: "Sam Levenson" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny. Also, great stories for parties.", author: "C.S. Lewis" },
  { text: "Start where you are. Use what you have. Do what you can. Google what you can't.", author: "Arthur Ashe (updated)" },
  { text: "The only impossible journey is the one you never begin. Also IKEA without instructions.", author: "Tony Robbins" },
  { text: "Dream big and dare to fail. But maybe have a backup plan too.", author: "Norman Vaughan" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what's in the fridge.", author: "Ralph Waldo Emerson (hungry edition)" },
  { text: "You miss 100% of the shots you don't take. Also 100% of the deadlines you ignore.", author: "Wayne Gretzky" },
  { text: "A journey of a thousand miles begins with a single step... and good walking shoes.", author: "Lao Tzu" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you. Also, don't forget sunscreen.", author: "Walt Whitman" },
  { text: "The secret of getting ahead is getting started. The secret of staying ahead? Coffee.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done. Then it seems like 'why did I stress so much?'", author: "Nelson Mandela" },
  { text: "Success usually comes to those who are too busy to be looking for it. Or too caffeinated.", author: "Henry David Thoreau" },
  { text: "I find that the harder I work, the more luck I seem to have. Coincidence? I think not.", author: "Thomas Jefferson" },
];

export function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
