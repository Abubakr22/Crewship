
import { UserProfile } from "../types";

// Simple synonym map for related interest matching
const SYNONYMS: Record<string, string[]> = {
  'coding': ['programming', 'developer', 'software', 'cs', 'python', 'javascript', 'apps', 'web'],
  'study': ['learn', 'learning', 'homework', 'sat', 'prep', 'reading', 'revise', 'revision'],
  'building': ['builder', 'startup', 'entrepreneur', 'projects', 'maker', 'hacks', 'hacker'],
  'design': ['art', 'ui', 'ux', 'creative', 'figma', 'graphics'],
  'sports': ['gym', 'fitness', 'basketball', 'soccer', 'swimming', 'volleyball', 'running'],
  'music': ['guitar', 'piano', 'singing', 'band', 'production', 'beats']
};

const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'for', 'on', 'with', 'as', 'at', 'an', 'be', 'this', 'that', 'i', 'my', 'me', 'am', 'are', 'was', 'looking', 'passionate', 'about', 'really', 'just']);

export const normalizeAndTokenize = (text: string): string[] => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    .map(word => {
      // Basic stemming/root matching
      if (word.endsWith('ing')) return word.slice(0, -3);
      if (word.endsWith('er')) return word.slice(0, -2);
      if (word.endsWith('s') && word.length > 4) return word.slice(0, -1);
      return word;
    });
};

export interface MatchResult {
  user: UserProfile;
  score: number;
  reasons: string[];
}

export const calculateMatch = (me: UserProfile, target: UserProfile): MatchResult => {
  let score = 0;
  const reasons: string[] = [];
  const matchedInterests: string[] = [];

  // 1. Exact Interest Match (+10 each)
  me.interests.forEach(interest => {
    if (target.interests.map(i => i.toLowerCase()).includes(interest.toLowerCase())) {
      score += 10;
      matchedInterests.push(interest);
    }
  });

  if (matchedInterests.length > 0) {
    reasons.push(`Matched on: ${matchedInterests.join(', ')}`);
  }

  // 2. Related Interest Match (+5 each)
  const relatedMatches: string[] = [];
  me.interests.forEach(myInt => {
    const myRoot = myInt.toLowerCase();
    target.interests.forEach(targetInt => {
      const targetLower = targetInt.toLowerCase();
      if (myRoot === targetLower) return; // Skip exact matches

      // Check if target interest is a synonym of mine
      if (SYNONYMS[myRoot]?.includes(targetLower)) {
        score += 5;
        relatedMatches.push(targetInt);
      }
    });
  });

  if (relatedMatches.length > 0) {
    reasons.push(`Related: ${relatedMatches.slice(0, 2).join(', ')}`);
  }

  // 3. Bio Keyword Match (+3 each)
  const myBioKeywords = me.normalizedBioKeywords || normalizeAndTokenize(me.bio);
  const targetBioKeywords = target.normalizedBioKeywords || normalizeAndTokenize(target.bio);
  
  const bioMatches: string[] = [];
  myBioKeywords.forEach(word => {
    if (targetBioKeywords.includes(word)) {
      score += 3;
      if (!bioMatches.includes(word)) bioMatches.push(word);
    }
  });

  if (bioMatches.length > 0) {
    reasons.push(`Bio match: '${bioMatches.slice(0, 2).join("', '")}'`);
  }

  return { user: target, score, reasons };
};
