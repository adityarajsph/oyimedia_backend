const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "was",
  "were",
  "have",
  "has",
  "not",
  "but",
  "our",
  "into",
  "about",
  "over",
  "after",
  "before",
  "than",
  "then",
  "when",
  "what",
  "which",
  "their",
  "they",
  "will",
  "can",
  "how",
  "why",
  "who",
]);

export function tokensFrom(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP.has(word));
}

export function scoreText(haystack: string, words: string[]) {
  const hay = haystack.toLowerCase();
  return words.reduce((score, word) => score + (hay.includes(word) ? 1 : 0), 0);
}
