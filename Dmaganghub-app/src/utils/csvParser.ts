import type { PokemonCard, Rarity } from '@/data/pokemonSet';

export interface CSVRow {
  id: string;
  name: string;
  rarity: string;
}

function parseRarity(value: string): Rarity {
  const normalized = value.toLowerCase().trim();

  if (normalized === 'common') return 'common';
  if (normalized === 'uncommon') return 'uncommon';
  if (normalized === 'rare') return 'rare';
  if (normalized === 'double-rare' || normalized === 'double rare') return 'double-rare';
  if (normalized === 'illustration-rare' || normalized === 'illustration rare') return 'illustration-rare';
  if (normalized === 'ultra-rare' || normalized === 'ultra rare') return 'ultra-rare';
  if (normalized === 'special-illustration-rare' || normalized === 'special illustration rare') return 'special-illustration-rare';
  if (normalized === 'mega-hyper-rare' || normalized === 'mega hyper rare') return 'mega-hyper-rare';

  // Default fallback
  return 'common';
}

function hasReverseForRarity(rarity: Rarity): boolean {
  // Only common, uncommon, and rare have reverse holo
  // All higher rarities (double-rare and above) don't have reverse
  return rarity === 'common' || rarity === 'uncommon' || rarity === 'rare';
}

export function parseCSV(csvText: string): PokemonCard[] {
  const lines = csvText.split('\n').filter(line => line.trim());

  // Detect delimiter and format
  const firstLine = lines[0].toLowerCase();

  // Check if it's the "ID,RITY,nme" format or "id,name,rarity" format
  const isAltFormat = firstLine.includes('rity') && !firstLine.includes('rarity');
  const hasHeader = firstLine.includes('id') || firstLine.includes('name') || firstLine.includes('rity');

  const startIndex = hasHeader ? 1 : 0;
  const cards: PokemonCard[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted values)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    let id: string, name: string, rarity: string;

    if (isAltFormat) {
      // Format: ID,RITY,nme
      [id, rarity, name] = values;
    } else {
      // Format: id,name,rarity (or similar)
      // Try to detect which column is which
      if (values.length >= 3) {
        // If third value looks like rarity, use: id, name, rarity
        const thirdVal = values[2].toLowerCase();
        if (thirdVal.includes('common') || thirdVal.includes('uncommon') ||
            thirdVal.includes('rare') || thirdVal.includes('ultra') ||
            thirdVal.includes('special') || thirdVal.includes('mega')) {
          [id, name, rarity] = values;
        } else {
          // Otherwise try: id, rarity, name
          [id, rarity, name] = values;
        }
      } else {
        continue; // Skip invalid lines
      }
    }

    cards.push({
      id: id?.replace(/"/g, '').trim() || String(i),
      name: name?.replace(/"/g, '').trim() || '',
      rarity: parseRarity(rarity || 'common'),
      hasReverse: hasReverseForRarity(parseRarity(rarity || 'common')),
    });
  }

  return cards;
}

export function saveToLocalStorage(cards: PokemonCard[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tcg-checklist-data', JSON.stringify(cards));
  }
}

export function loadFromLocalStorage(): PokemonCard[] | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('tcg-checklist-data');
    if (data) {
      try {
        return JSON.parse(data) as PokemonCard[];
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearLocalStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tcg-checklist-data');
  }
}

// Logo storage
export function saveLogoToStorage(base64: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tcg-checklist-logo', base64);
  }
}

export function loadLogoFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tcg-checklist-logo');
  }
  return null;
}

export function clearLogoFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tcg-checklist-logo');
  }
}

// Set title storage
export function saveSetTitleToStorage(title: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tcg-checklist-set-title', title);
  }
}

export function loadSetTitleFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tcg-checklist-set-title');
  }
  return null;
}

export function clearSetTitleFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tcg-checklist-set-title');
  }
}
