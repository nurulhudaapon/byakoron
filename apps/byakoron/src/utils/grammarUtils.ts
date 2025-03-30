import { tokenizeToWords } from '@bntk/tokenization';
import { transliterate as transliterateBangla } from '@bntk/transliteration';
/**
 * Basic grammar and text processing utilities
 */

/**
 * Tokenizes a string into words and punctuation
 */
export const tokenize = (text: string): string[] => {
  // Simple tokenization by splitting on whitespace and preserving punctuation
  return tokenizeToWords(text) || [];
};

/**
 * Very basic spell checker with common mistakes
 */
export const checkSpelling = (word: string): { correct: boolean, suggestions: string[] } => {
  // Common misspelled words and their corrections
  const commonMisspellings: { [key: string]: string[] } = {
    'teh': ['the'],
    'definately': ['definitely'],
    'recieve': ['receive'],
    'wierd': ['weird'],
    'accomodate': ['accommodate'],
    'occured': ['occurred'],
    'seperate': ['separate'],
    'untill': ['until'],
    'alot': ['a lot'],
    'thier': ['their'],
    'theres': ['there\'s'],
    'youre': ['you\'re'],
    'thats': ['that\'s'],
    'wont': ['won\'t'],
    'cant': ['can\'t'],
    'dont': ['don\'t'],
    'isnt': ['isn\'t'],
  };

  // Check if the word is in our misspelling dictionary
  if (commonMisspellings[word.toLowerCase()]) {
    return {
      correct: false,
      suggestions: commonMisspellings[word.toLowerCase()]
    };
  }

  // Basic check for repeated letters that typically don't appear in English
  const repeatedLetters = word.match(/(.)\1{2,}/);
  if (repeatedLetters) {
    const corrected = word.replace(/(.)\1{2,}/g, '$1$1');
    return { 
      correct: false, 
      suggestions: [corrected] 
    };
  }

  // If we don't have specific checks for this word, assume it's correct
  return { correct: true, suggestions: [] };
};

/**
 * Basic grammar checker for common issues
 */
export const checkGrammar = (text: string): { correct: boolean, issues: { index: number, message: string }[] } => {
  const issues: { index: number, message: string }[] = [];
  const tokens = tokenize(text);
  
  // Check for double words (e.g., "the the")
  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i].toLowerCase() === tokens[i-1].toLowerCase() && tokens[i].match(/\w+/)) {
      const index = text.toLowerCase().indexOf(tokens[i].toLowerCase(), text.toLowerCase().indexOf(tokens[i-1].toLowerCase()) + tokens[i-1].length);
      issues.push({
        index,
        message: `Possible duplicate word: "${tokens[i]}"`
      });
    }
  }

  // Check for common grammar issues
  const commonErrors = [
    { pattern: /\bi am\b/gi, suggestion: 'I am' },
    { pattern: /\bi\s+(?:is|are|was|were)\b/gi, message: 'Incorrect verb agreement with "I"' },
    { pattern: /\bthey is\b/gi, message: 'Use "they are" instead of "they is"' },
    { pattern: /\bhe are\b/gi, message: 'Use "he is" instead of "he are"' },
    { pattern: /\bshe are\b/gi, message: 'Use "she is" instead of "she are"' },
    { pattern: /\bit are\b/gi, message: 'Use "it is" instead of "it are"' },
  ];

  commonErrors.forEach(error => {
    let match;
    while ((match = error.pattern.exec(text)) !== null) {
      issues.push({
        index: match.index,
        message: error.message || `Consider using "${error.suggestion}" instead`
      });
    }
  });

  return {
    correct: issues.length === 0,
    issues,
  };
};

/**
 * Simple English to Bangla transliteration for common words
 */
export const transliterate = (text: string): string => {
  return transliterateBangla(text, {
    mode: 'orva'
  })
};

/**
 * Basic stemming function (rule-based for English)
 */
export const stem = (word: string): string => {
  // Very simple rule-based stemmer
  let stemmed = word.toLowerCase();
  
  // Remove common suffixes
  if (stemmed.endsWith('ing')) {
    // Check for doubling rule (e.g., running -> run)
    if (stemmed.length > 5 && stemmed[stemmed.length-4] === stemmed[stemmed.length-5]) {
      stemmed = stemmed.slice(0, -4);
    } else {
      stemmed = stemmed.slice(0, -3);
      // Add 'e' back in some cases (like 'coming' -> 'come')
      if (/[^aeiou][aeiou][^aeiouwxy]$/.test(stemmed)) {
        stemmed += 'e';
      }
    }
  } else if (stemmed.endsWith('ed') && stemmed.length > 3) {
    // Similar to 'ing'
    if (stemmed.length > 4 && stemmed[stemmed.length-3] === stemmed[stemmed.length-4]) {
      stemmed = stemmed.slice(0, -3);
    } else {
      stemmed = stemmed.slice(0, -2);
      // Add 'e' back in some cases
      if (/[^aeiou][aeiou][^aeiouwxy]$/.test(stemmed)) {
        stemmed += 'e';
      }
    }
  } else if (stemmed.endsWith('ly')) {
    stemmed = stemmed.slice(0, -2);
  } else if (stemmed.endsWith('s') && !stemmed.endsWith('ss') && stemmed.length > 2) {
    stemmed = stemmed.slice(0, -1);
  } else if (stemmed.endsWith('es') && stemmed.length > 3) {
    stemmed = stemmed.slice(0, -2);
  }
  
  return stemmed;
}; 