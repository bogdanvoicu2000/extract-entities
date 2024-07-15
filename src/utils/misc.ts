import { Entities, Entity } from '../types/entities';

export function sanitizeSearchTerm(searchTerm: string): string {
  // Remove quotes which can cause issues in tsquery
  return searchTerm.replace(/['"]/g, '');
}

// Function that iterates through each entity type (city, brand, dishType, diet)
// and creates combinations based on whether they share the same searchWord.
export function transformCombinations(originalCombinations: Entities[]): Entities[] {
  const transformedCombinations: Entities[] = [];

  for (const combination of originalCombinations) {
    const entities: { [key: string]: Entity } = {
      ...(combination.city && { city: combination.city }),
      ...(combination.brand && { brand: combination.brand }),
      ...(combination.dishType && { dishType: combination.dishType }),
      ...(combination.diet && { diet: combination.diet }),
    };

    const usedSearchWords: Set<string> = new Set();

    const combinations: Entities[] = [];

    for (const [type, entity] of Object.entries(entities)) {
      const { id, name, searchWord } = entity;
      if (usedSearchWords.has(entity.searchWord)) {
        const newEntity: Entities = {};
        for (const [t, e] of Object.entries(entities)) {
          if (entity.searchWord !== e.searchWord) {
            // @ts-ignore
            newEntity[t] = { id: e.id, name: e.name };
          }
        }
        combinations.push({ [type]: { id, name }, ...newEntity });
      } else {
        usedSearchWords.add(entity.searchWord);
        const currentCombination: Entities = combinations.length
          ? combinations.pop()!
          : {};
        // @ts-ignore
        currentCombination[type] = { id, name };
        combinations.push(currentCombination);
      }
    }

    transformedCombinations.push(...combinations);
  }

  return transformedCombinations;
}