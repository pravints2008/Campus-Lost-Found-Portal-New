import { LostFoundItem, MatchResult } from '../types';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'with', 'by', 'for', 'of', 'and', 'or', 'to',
  'is', 'was', 'my', 'near', 'table', 'floor', 'desk', 'room', 'block', 'found', 'lost'
]);

/**
 * Extracts normalized tokens from a text string, ignoring common filler words.
 */
function extractTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Determines if two color descriptions overlap or match.
 */
function isColorMatch(color1: string, color2: string): boolean {
  const c1 = color1.toLowerCase().trim();
  const c2 = color2.toLowerCase().trim();
  if (c1 === c2) return true;
  if (c1.includes(c2) || c2.includes(c1)) return true;
  
  // Common color synonyms
  const synonyms: Record<string, string[]> = {
    blue: ['navy', 'cyan', 'sky', 'teal', 'azure', 'dark blue', 'light blue'],
    black: ['dark', 'charcoal', 'matte black', 'grey', 'gray'],
    white: ['cream', 'off-white', 'silver', 'ivory'],
    red: ['maroon', 'crimson', 'scarlet', 'burgundy'],
    green: ['olive', 'mint', 'emerald', 'lime'],
    yellow: ['gold', 'amber', 'mustard'],
    brown: ['tan', 'khaki', 'beige', 'coffee'],
  };

  for (const [key, variants] of Object.entries(synonyms)) {
    const match1 = c1 === key || variants.some(v => c1.includes(v));
    const match2 = c2 === key || variants.some(v => c2.includes(v));
    if (match1 && match2) return true;
  }

  return false;
}

/**
 * Calculates rule-based match score between a lost item and a found item.
 */
export function calculateMatchScore(lost: LostFoundItem, found: LostFoundItem): MatchResult | null {
  // Never match items of the same report type
  if (lost.type === found.type) return null;
  // Ensure lost is 'lost' and found is 'found'
  if (lost.type !== 'lost') {
    const temp = lost;
    lost = found;
    found = temp;
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Category Matching (40 points)
  const categoryMatched = lost.category === found.category;
  if (categoryMatched) {
    score += 40;
    reasons.push(`Category match: ${lost.category}`);
  } else {
    // If categories are completely different (and neither is 'Others'), matching is unlikely
    if (lost.category !== 'Others' && found.category !== 'Others') {
      return null;
    }
    score += 10;
  }

  // 2. Color Matching (20 points)
  const colorMatched = isColorMatch(lost.color, found.color);
  if (colorMatched) {
    score += 20;
    reasons.push(`Colour match: ${lost.color} & ${found.color}`);
  }

  // 3. Location Matching (20 points)
  const locationMatched = lost.location === found.location;
  if (locationMatched) {
    score += 20;
    reasons.push(`Location match: ${lost.location}`);
  }

  // 4. Title / Token Overlap (up to 15 points)
  const lostTokens = extractTokens(lost.title + ' ' + (lost.description || ''));
  const foundTokens = extractTokens(found.title + ' ' + (found.description || ''));
  const commonTokens = lostTokens.filter(t => foundTokens.includes(t));
  const uniqueCommonTokens = Array.from(new Set(commonTokens));

  const titleMatched = uniqueCommonTokens.length > 0;
  if (titleMatched) {
    const tokenPoints = Math.min(15, uniqueCommonTokens.length * 5);
    score += tokenPoints;
    reasons.push(`Matching keywords: "${uniqueCommonTokens.slice(0, 3).join(', ')}"`);
  }

  // 5. Date Proximity (up to 10 points)
  let dateProximity = false;
  if (lost.date && found.date) {
    const lostDate = new Date(lost.date).getTime();
    const foundDate = new Date(found.date).getTime();
    const diffDays = (foundDate - lostDate) / (1000 * 60 * 60 * 24);

    // Found on or within 7 days after lost date
    if (diffDays >= 0 && diffDays <= 7) {
      score += 10;
      dateProximity = true;
      reasons.push('Reported dates align within a 7-day window');
    }
  }

  // Threshold: To qualify as a "Possible Match", score must be at least 45%
  // AND must match at least category + 1 additional attribute (color, location, or keywords)
  const matchesMultipleAttributes = (categoryMatched ? 1 : 0) + 
    (colorMatched ? 1 : 0) + 
    (locationMatched ? 1 : 0) + 
    (titleMatched ? 1 : 0) >= 2;

  if (score >= 45 && matchesMultipleAttributes) {
    return {
      lostItem: lost,
      foundItem: found,
      matchScore: Math.min(100, score),
      matchedFields: {
        category: categoryMatched,
        color: colorMatched,
        location: locationMatched,
        title: titleMatched,
        dateProximity,
      },
      reasons,
    };
  }

  return null;
}

/**
 * Finds all possible matches across all items in the repository.
 * Filters out items marked as 'Returned'.
 */
export function findAllMatches(items: LostFoundItem[]): MatchResult[] {
  const activeItems = items.filter(item => item.status !== 'Returned');
  const lostItems = activeItems.filter(item => item.type === 'lost');
  const foundItems = activeItems.filter(item => item.type === 'found');

  const matches: MatchResult[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const match = calculateMatchScore(lost, found);
      if (match) {
        matches.push(match);
      }
    }
  }

  // Sort by highest match score first
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Finds all possible matches for a specific item (either lost or found).
 */
export function findMatchesForItem(targetItem: LostFoundItem, allItems: LostFoundItem[]): MatchResult[] {
  if (targetItem.status === 'Returned') return [];

  const otherType = targetItem.type === 'lost' ? 'found' : 'lost';
  const candidates = allItems.filter(i => i.type === otherType && i.status !== 'Returned');

  const matches: MatchResult[] = [];

  for (const candidate of candidates) {
    const lost = targetItem.type === 'lost' ? targetItem : candidate;
    const found = targetItem.type === 'found' ? targetItem : candidate;
    const match = calculateMatchScore(lost, found);
    if (match) {
      matches.push(match);
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
