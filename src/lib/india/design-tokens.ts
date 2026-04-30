/**
 * India Dashboard Design Tokens
 *
 * Canonical visual system. Sources: file 38 (hero locked), file 45 (full design system).
 * DO NOT hardcode visual values in components. Always import from here.
 *
 * Last updated: 30 Apr 2026
 */

export const IndiaTypography = {
  // Headlines
  hero: {
    fontFamily: 'var(--font-jakarta)',
    fontSize: '60px',
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  // Bilingual title rotator
  bilingual: {
    fontFamily: 'var(--font-serif)',
    fontSize: '26px',
    fontWeight: 400,
  },
  // Section headers
  sectionHeader: {
    fontFamily: 'var(--font-jakarta)',
    fontSize: '22px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  // Module card titles
  moduleTitle: {
    fontFamily: 'var(--font-jakarta)',
    fontSize: '14px',
    fontWeight: 500,
  },
  // KPI numbers (always JetBrains Mono)
  kpiNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: 1.1,
  },
  // KPI label
  kpiLabel: {
    fontSize: '11px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  // Body text
  body: {
    fontSize: '14px',
    lineHeight: 1.5,
  },
  // Captions / source lines
  caption: {
    fontSize: '11px',
  },
} as const;

export const IndiaSpacing = {
  cardPaddingY: '14px',
  cardPaddingX: '16px',
  gridGapSmall: '12px',
  gridGapMedium: '14px',
  gridGapLarge: '32px',
  sectionMarginBottom: '1.5rem',
  bandMarginBottom: '2rem',
} as const;

/**
 * 10 super-category accent colors per file 45 Section 1.
 * Each entry has: name (key), hex (raw value), bg (50-stop fill), text (800-stop on bg).
 */
export const IndiaSuperCategoryAccents = {
  blue:           { name: 'blue',         hex: '#185FA5', bg: '#E6F1FB', text: '#0C447C' },
  indigo:         { name: 'indigo',       hex: '#534AB7', bg: '#EEEDFE', text: '#3C3489' },
  teal:           { name: 'teal',         hex: '#0F6E56', bg: '#E1F5EE', text: '#085041' },
  'forest-green': { name: 'forest-green', hex: '#5A8F2E', bg: '#EAF3DE', text: '#27500A' },
  wheat:          { name: 'wheat',        hex: '#B58A1E', bg: '#FAEEDA', text: '#633806' },
  slate:          { name: 'slate',        hex: '#4A5358', bg: '#E8EAEC', text: '#2C3033' },
  amber:          { name: 'amber',        hex: '#854F0B', bg: '#FAEEDA', text: '#633806' },
  purple:         { name: 'purple',       hex: '#3C3489', bg: '#EEEDFE', text: '#26215C' },
  coral:          { name: 'coral',        hex: '#993C1D', bg: '#FAECE7', text: '#712B13' },
  pink:           { name: 'pink',         hex: '#993556', bg: '#FBEAF0', text: '#72243E' },
} as const;

export type IndiaAccentColorKey = keyof typeof IndiaSuperCategoryAccents;

/**
 * Tricolor — used CEREMONIALLY only per file 45 Foundational Principle 6.
 * Never as flag stripes, never as Chakra, never as background fills, never on modules.
 */
export const IndiaTricolor = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  saffronWashOpacity: 0.16,
  greenWashOpacity: 0.16,
  containerOpacity: 0.4,
} as const;

export const IndiaMotion = {
  langRotationInterval: 2200,  // ms per language
  langFadeDuration: 400,       // ms fade transition
  cardHoverDuration: 150,      // ms
  modalEnterDuration: 200,     // ms
} as const;

/**
 * 22 scheduled languages of India per Schedule 8 of the Constitution.
 * Used by the bilingual title rotator on /en/india hero.
 *
 * NOTE: Native-speaker verification is pending in Phase 4 for entries marked below.
 */
export const IndiaScheduledLanguages = [
  { script: 'भारत',          name: 'Hindi',     code: 'hi'  },
  { script: 'ಭಾರತ',         name: 'Kannada',   code: 'kn'  },
  { script: 'இந்தியா',     name: 'Tamil',     code: 'ta'  },
  { script: 'ভারত',          name: 'Bengali',   code: 'bn'  },
  { script: 'భారత్',         name: 'Telugu',    code: 'te'  },
  { script: 'भारत',          name: 'Marathi',   code: 'mr'  },
  { script: 'ભારત',          name: 'Gujarati',  code: 'gu'  },
  { script: 'ਭਾਰਤ',          name: 'Punjabi',   code: 'pa'  },
  { script: 'ഇന്ത്യ',     name: 'Malayalam', code: 'ml'  },
  { script: 'ଭାରତ',          name: 'Odia',      code: 'or'  },
  { script: 'ভাৰত',          name: 'Assamese',  code: 'as'  },
  { script: 'بھارت',         name: 'Urdu',      code: 'ur'  },
  { script: 'भारतम्',        name: 'Sanskrit',  code: 'sa'  },
  { script: 'भारत',          name: 'Sindhi',    code: 'sd'  },  // verify in Phase 4
  { script: 'भारत',          name: 'Konkani',   code: 'kok' },  // verify in Phase 4
  { script: 'ꯏꯟꯗꯤꯌꯥ',   name: 'Manipuri',  code: 'mni' },
  { script: 'भारत',          name: 'Nepali',    code: 'ne'  },  // verify in Phase 4
  { script: 'भारत',          name: 'Bodo',      code: 'brx' },  // verify in Phase 4
  { script: 'भारत',          name: 'Dogri',     code: 'doi' },  // verify in Phase 4
  { script: 'भारत',          name: 'Maithili',  code: 'mai' },  // verify in Phase 4
  { script: 'ᱥᱤᱧᱚᱛ',        name: 'Santali',   code: 'sat' },
  { script: 'ہِندوستان',     name: 'Kashmiri',  code: 'ks'  },
] as const;
