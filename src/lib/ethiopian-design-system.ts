/**
 * Ethiopian Design System
 * 
 * This module provides cultural patterns, symbols, and design elements
 * inspired by Ethiopian culture for use throughout the application.
 */

/**
 * Ethiopian color palette based on the Ethiopian flag and cultural colors
 */
export const ethiopianColors = {
  gold: '#FFD700',   // Gold/Yellow from Ethiopian flag
  green: '#078930',  // Green from Ethiopian flag
  red: '#DA121A',    // Red from Ethiopian flag
  coffee: '#6F4E37', // Ethiopian coffee color
  teff: '#C2B280',   // Teff grain color
  injera: '#D7CEC7', // Injera (traditional bread) color
  berbere: '#9B2335' // Berbere spice color
};

/**
 * Ethiopian pattern types
 */
export enum PatternType {
  CROSS = 'cross',
  LALIBELA = 'lalibela',
  AXUM = 'axum',
  TELSEM = 'telsem',
  ADBAR = 'adbar',
  MESKEL = 'meskel'
}

/**
 * Ethiopian cultural symbols
 */
export enum SymbolType {
  LION_OF_JUDAH = 'lion-of-judah',
  COFFEE_CEREMONY = 'coffee-ceremony',
  MESKEL_DAISY = 'meskel-daisy',
  LALIBELA_CROSS = 'lalibela-cross',
  TIMKET = 'timket',
  ADBAR = 'adbar'
}

/**
 * Pattern definitions with SVG paths
 */
export const ethiopianPatterns = {
  [PatternType.CROSS]: {
    name: 'Ethiopian Cross',
    description: 'Traditional Ethiopian Orthodox cross pattern',
    svgPath: `
      <pattern id="ethiopian-cross" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M10,2 L10,18 M2,10 L18,10" stroke="currentColor" stroke-width="2" />
        <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1" />
      </pattern>
    `,
    cssClass: 'pattern-ethiopian-cross'
  },
  [PatternType.LALIBELA]: {
    name: 'Lalibela Pattern',
    description: 'Inspired by the rock-hewn churches of Lalibela',
    svgPath: `
      <pattern id="lalibela-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="40" height="40" fill="none" />
        <path d="M0,20 L40,20 M20,0 L20,40 M0,0 L40,40 M40,0 L0,40" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" />
      </pattern>
    `,
    cssClass: 'pattern-lalibela'
  },
  [PatternType.AXUM]: {
    name: 'Axum Stelae',
    description: 'Pattern inspired by the ancient Axum stelae',
    svgPath: `
      <pattern id="axum-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect x="10" y="5" width="10" height="50" rx="2" stroke="currentColor" fill="none" />
        <rect x="30" y="10" width="8" height="40" rx="2" stroke="currentColor" fill="none" />
        <rect x="45" y="15" width="6" height="30" rx="2" stroke="currentColor" fill="none" />
      </pattern>
    `,
    cssClass: 'pattern-axum'
  },
  [PatternType.TELSEM]: {
    name: 'Telsem Pattern',
    description: 'Traditional Ethiopian protective pattern',
    svgPath: `
      <pattern id="telsem-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" />
        <path d="M25,5 L25,45 M5,25 L45,25 M10,10 L40,40 M40,10 L10,40" stroke="currentColor" stroke-width="1" />
      </pattern>
    `,
    cssClass: 'pattern-telsem'
  },
  [PatternType.ADBAR]: {
    name: 'Adbar Pattern',
    description: 'Inspired by traditional Ethiopian spiritual symbols',
    svgPath: `
      <pattern id="adbar-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="7" fill="none" stroke="currentColor" />
        <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" stroke-dasharray="2,2" />
      </pattern>
    `,
    cssClass: 'pattern-adbar'
  },
  [PatternType.MESKEL]: {
    name: 'Meskel Pattern',
    description: 'Pattern inspired by the Meskel celebration',
    svgPath: `
      <pattern id="meskel-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20,5 L20,35 M5,20 L35,20" stroke="currentColor" stroke-width="2" />
        <path d="M20,5 L5,20 L20,35 L35,20 Z" fill="none" stroke="currentColor" stroke-width="1" />
      </pattern>
    `,
    cssClass: 'pattern-meskel'
  }
};

/**
 * Symbol definitions with SVG paths
 */
export const ethiopianSymbols = {
  [SymbolType.LION_OF_JUDAH]: {
    name: 'Lion of Judah',
    description: 'Symbol of Ethiopian monarchy and strength',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,20 C60,20 70,25 75,35 C80,45 80,55 75,65 C70,75 60,80 50,80 C40,80 30,75 25,65 C20,55 20,45 25,35 C30,25 40,20 50,20 Z" fill="none" stroke="currentColor" stroke-width="2" />
        <circle cx="40" cy="40" r="3" fill="currentColor" />
        <circle cx="60" cy="40" r="3" fill="currentColor" />
        <path d="M40,60 C45,65 55,65 60,60" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M30,30 L20,20 M70,30 L80,20" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    `,
    cssClass: 'symbol-lion-of-judah'
  },
  [SymbolType.COFFEE_CEREMONY]: {
    name: 'Coffee Ceremony',
    description: 'Symbol of Ethiopian hospitality and tradition',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,70 C30,50 70,50 70,70 C70,80 65,85 50,85 C35,85 30,80 30,70 Z" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M40,50 L40,30 C40,25 60,25 60,30 L60,50" fill="none" stroke="currentColor" stroke-width="2" />
        <ellipse cx="50" cy="30" rx="15" ry="5" fill="none" stroke="currentColor" stroke-width="1" />
      </svg>
    `,
    cssClass: 'symbol-coffee-ceremony'
  },
  [SymbolType.MESKEL_DAISY]: {
    name: 'Meskel Daisy',
    description: 'Symbol of the Ethiopian Meskel celebration',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        <path d="M50,20 L50,80 M20,50 L80,50 M35,35 L65,65 M35,65 L65,35" stroke="currentColor" stroke-width="2" />
      </svg>
    `,
    cssClass: 'symbol-meskel-daisy'
  },
  [SymbolType.LALIBELA_CROSS]: {
    name: 'Lalibela Cross',
    description: 'Symbol of Ethiopian Orthodox Christianity',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,20 L50,80 M30,50 L70,50" stroke="currentColor" stroke-width="3" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M30,30 L40,40 M60,40 L70,30 M30,70 L40,60 M60,60 L70,70" stroke="currentColor" stroke-width="2" />
      </svg>
    `,
    cssClass: 'symbol-lalibela-cross'
  },
  [SymbolType.TIMKET]: {
    name: 'Timket Symbol',
    description: 'Symbol of the Ethiopian Epiphany celebration',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M50,30 L50,40 M50,60 L50,70 M30,50 L40,50 M60,50 L70,50" stroke="currentColor" stroke-width="2" />
      </svg>
    `,
    cssClass: 'symbol-timket'
  },
  [SymbolType.ADBAR]: {
    name: 'Adbar Symbol',
    description: 'Traditional Ethiopian spiritual symbol',
    svgPath: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M50,20 L50,80 M20,50 L80,50" stroke="currentColor" stroke-width="2" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="1" />
      </svg>
    `,
    cssClass: 'symbol-adbar'
  }
};

/**
 * Get an Ethiopian pattern by type
 */
export function getEthiopianPattern(type: PatternType) {
  return ethiopianPatterns[type];
}

/**
 * Get an Ethiopian symbol by type
 */
export function getEthiopianSymbol(type: SymbolType) {
  return ethiopianSymbols[type];
}

/**
 * Generate CSS for all Ethiopian patterns
 */
export function generateEthiopianPatternCSS() {
  return Object.values(ethiopianPatterns).map(pattern => {
    return `.${pattern.cssClass} {
      background-image: url("data:image/svg+xml,${encodeURIComponent(pattern.svgPath)}");
    }`;
  }).join('\n');
}

/**
 * Cultural design elements for different contexts
 */
export const culturalDesignElements = {
  // Achievement-related elements
  achievement: {
    colors: [ethiopianColors.gold, ethiopianColors.green],
    pattern: PatternType.MESKEL,
    symbol: SymbolType.LION_OF_JUDAH
  },
  
  // Growth-related elements
  growth: {
    colors: [ethiopianColors.green, ethiopianColors.teff],
    pattern: PatternType.TELSEM,
    symbol: SymbolType.MESKEL_DAISY
  },
  
  // Transformation-related elements
  transformation: {
    colors: [ethiopianColors.red, ethiopianColors.gold],
    pattern: PatternType.LALIBELA,
    symbol: SymbolType.TIMKET
  },
  
  // Community-related elements
  community: {
    colors: [ethiopianColors.coffee, ethiopianColors.injera],
    pattern: PatternType.ADBAR,
    symbol: SymbolType.COFFEE_CEREMONY
  },
  
  // Spiritual-related elements
  spiritual: {
    colors: [ethiopianColors.gold, ethiopianColors.berbere],
    pattern: PatternType.CROSS,
    symbol: SymbolType.LALIBELA_CROSS
  }
};

/**
 * Get cultural design elements for a specific context
 */
export function getCulturalDesignForContext(context: keyof typeof culturalDesignElements) {
  return culturalDesignElements[context] || culturalDesignElements.achievement;
}