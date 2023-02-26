export function getRandomSearchQuery() {
  const DEFAULT_SEARCH_QUERIES = [
    "smart",
    "art",
    "love",
    "trade",
    "technology",
    "adventure",
    "ceo",
    "africa",
    "energy",
    "climate",
    "sense",
  ];
  const randomIndex = Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length);

  return DEFAULT_SEARCH_QUERIES[randomIndex];
}
