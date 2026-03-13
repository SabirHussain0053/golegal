'use client';

/**
 * Outline List Plugin for Plate Editor
 *
 * Provides multi-level / legal-style numbering: 1, 1.1, 1.2, 2, 2.1, 2.1.1, etc.
 *
 * Works with Plate's indent-based list system by introducing a custom
 * `listStyleType` value ("outlineDecimal") that the BlockList component
 * recognises and renders with computed outline numbering.
 */

// ─── Constants ────────────────────────────────────────────────────────
export const OUTLINE_DECIMAL = 'outlineDecimal';

// ─── Outline Number Computation ───────────────────────────────────────
/**
 * Walk through editor.children from the beginning up to (and including)
 * `targetIndex` and return the computed outline number string, e.g. "2.3.1".
 *
 * Rules:
 *  - Any non-outlineDecimal node resets all counters (it breaks the sequence).
 *  - When an outlineDecimal node at indent level L is encountered:
 *      1. Increment the counter for level L.
 *      2. Reset all counters for levels deeper than L.
 *  - The final outline string is built from counters at levels 1…currentIndent.
 */
export function computeOutlineNumber(
  children: any[],
  targetIndex: number,
): string {
  const targetNode = children[targetIndex];
  if (!targetNode) return '1';

  const targetIndent = targetNode.indent || 1;

  // counters is a map: level (1-based) -> count
  const counters: Record<number, number> = {};

  for (let i = 0; i <= targetIndex; i++) {
    const node = children[i];

    if (node.listStyleType !== OUTLINE_DECIMAL) {
      // Skip non-outline nodes — do NOT reset counters.
      // Legal/outline numbering is continuous across the document,
      // so paragraphs / headings between items shouldn't break the sequence.
      continue;
    }

    const indent: number = node.indent || 1;

    // Increment counter at this indent level
    counters[indent] = (counters[indent] || 0) + 1;

    // Reset deeper levels
    for (const key of Object.keys(counters)) {
      if (Number(key) > indent) {
        delete counters[Number(key)];
      }
    }
  }

  // Build the outline number string for levels 1…targetIndent
  const parts: number[] = [];
  for (let level = 1; level <= targetIndent; level++) {
    parts.push(counters[level] || 1);
  }

  return parts.join('.');
}

// ─── Helpers ──────────────────────────────────────────────────────────

/** Check whether a node is an outline-decimal list item */
export function isOutlineDecimal(element: any): boolean {
  return element?.listStyleType === OUTLINE_DECIMAL;
}

/**
 * Detect whether a text string starts with an outline number pattern
 * like "1.1", "2.3.1", "10.2", etc.
 * Returns the match or null.
 */
export function matchOutlinePrefix(
  text: string,
): { fullMatch: string; numbers: number[]; rest: string } | null {
  // Match patterns like "1.1", "1.1.", "2.3.1", "10.2.1 " at the start
  const match = text.match(/^(\d+(?:\.\d+)+)\.?\s+(.*)/s);
  if (!match) return null;

  const fullMatch = match[1];
  const numbers = fullMatch.split('.').map(Number);
  const rest = (match[2] || '').replace(/^\s+/, '');

  // Must have at least 2 levels to be considered outline
  if (numbers.length < 2) return null;
  // All numbers must be positive
  if (numbers.some((n) => n <= 0 || isNaN(n))) return null;

  return { fullMatch, numbers, rest };
}

/**
 * Detect whether text starts with a single-level numbered prefix like "1." or "2."
 * Used to identify top-level list items (headings in legal docs).
 */
export function matchSingleNumberPrefix(
  text: string,
): { number: number; rest: string } | null {
  const match = text.match(/^(\d+)\.\s+(.*)/s);
  if (!match) return null;

  const num = Number(match[1]);
  if (num <= 0 || isNaN(num)) return null;

  return { number: num, rest: (match[2] || '').replace(/^\s+/, '') };
}

/**
 * Detect lower-alpha list prefix like "a)", "b)", "a.", "b." at the start of text.
 * Matches both parenthesis and period styles.
 */
export function matchLowerAlphaPrefix(
  text: string,
): { letter: string; rest: string } | null {
  // Match "a)" or "a." followed by a space
  const match = text.match(/^([a-z])[.):]\s+(.*)/s);
  if (!match) return null;

  return { letter: match[1], rest: (match[2] || '').replace(/^\s+/, '') };
}

/**
 * Convert a lower-alpha letter to its numeric position (a=1, b=2, ... z=26)
 */
export function alphaToNumber(letter: string): number {
  return letter.charCodeAt(0) - 96; // 'a' = 97, so 97-96 = 1
}

// ─── Roman Numeral Helpers ────────────────────────────────────────────

const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};

/**
 * Convert a lowercase roman numeral string to a number.
 * e.g. "i"→1, "ii"→2, "iii"→3, "iv"→4, "ix"→9, "xiv"→14
 * Returns 0 if the string is not a valid roman numeral.
 */
export function romanToNumber(roman: string): number {
  if (!roman) return 0;
  const s = roman.toLowerCase();
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = ROMAN_VALUES[s[i]];
    const next = ROMAN_VALUES[s[i + 1]];
    if (!current) return 0; // invalid character
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}

// ─── Parenthesized / Prefixed Pattern Matchers ────────────────────────

/**
 * Match parenthesized alpha prefix: "(a) some text", "(b) some text"
 * Returns { letter, rest } or null.
 */
export function matchParenthesizedAlpha(
  text: string,
): { letter: string; rest: string } | null {
  const match = text.match(/^\(([a-zA-Z])\)\s+(.*)/s);
  if (!match) return null;
  return {
    letter: match[1].toLowerCase(),
    rest: (match[2] || '').replace(/^\s+/, ''),
  };
}

/**
 * Match parenthesized decimal prefix: "(1) some text", "(2) some text"
 * Returns { number, rest } or null.
 */
export function matchParenthesizedDecimal(
  text: string,
): { number: number; rest: string } | null {
  const match = text.match(/^\((\d+)\)\s+(.*)/s);
  if (!match) return null;
  const num = Number(match[1]);
  if (num <= 0 || isNaN(num)) return null;
  return { number: num, rest: (match[2] || '').replace(/^\s+/, '') };
}

/**
 * Match parenthesized roman prefix: "(i) some text", "(ii) some text", "(iv) text"
 * Returns { value, rest } or null.
 */
export function matchParenthesizedRoman(
  text: string,
): { value: number; rest: string } | null {
  const match = text.match(/^\(((?:x{0,3})(?:ix|iv|v?i{0,3}))\)\s+(.*)/s);
  if (!match || !match[1]) return null;
  const val = romanToNumber(match[1]);
  if (val <= 0) return null;
  return { value: val, rest: (match[2] || '').replace(/^\s+/, '') };
}

/**
 * Match lower-roman prefix (non-parenthesized): "i. text", "ii) text", "iv. text"
 * Must not match single "i" when it could be the word "I".
 * Returns { value, rest } or null.
 */
export function matchLowerRomanPrefix(
  text: string,
): { value: number; rest: string } | null {
  const match = text.match(/^((?:x{0,3})(?:ix|iv|v?i{0,3}))[.)]\s+(.*)/s);
  if (!match || !match[1]) return null;
  const val = romanToNumber(match[1]);
  if (val <= 0) return null;
  return { value: val, rest: (match[2] || '').replace(/^\s+/, '') };
}
