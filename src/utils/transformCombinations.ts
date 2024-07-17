import { Entities, EntityEnum } from '../types/entities';

// Function that iterates through each entity type (city, brand, dishType, diet)
// and creates combinations based on whether they share the same searchWord.
export function transformCombinations(originalCombinations: Entities[]): Entities[] {
  const transformedCombinations: Entities[] = [];

  for (const { city, dishType, brand, diet } of originalCombinations) {
    const entities: Entities = {
      ...(city && { city }),
      ...(brand && { brand }),
      ...(dishType && { dishType }),
      ...(diet && { diet }),
    };

    const usedSearchWords: Set<string> = new Set();

    const combinations: Entities[] = [];

    for (const [type, entity] of Object.entries(entities)) {
      const { id, name } = entity;
      if (usedSearchWords.has(entity.searchWord!)) {
        const newEntity: Entities = {};
        for (const [t, e] of Object.entries(entities)) {
          if (entity.searchWord !== e.searchWord) {
            newEntity[t as EntityEnum] = { id: e.id, name: e.name };
          }
        }
        combinations.push({ [type]: { id, name }, ...newEntity });
      } else {
        usedSearchWords.add(entity.searchWord!);
        const currentCombination: Entities = combinations.length
          ? combinations.pop()!
          : {};

        for (const [t, e] of Object.entries(entities)) {
          if (!usedSearchWords.has(e.searchWord!) && usedSearchWords.size > 1 && e.searchWord !== entity.searchWord) {
            currentCombination[t as EntityEnum] = { id: e.id, name: e.name };
          }
        }

        currentCombination[type as EntityEnum] = { id, name };
        combinations.push(currentCombination);
      }
    }

    transformedCombinations.push(...combinations);
  }

  return transformedCombinations;
}