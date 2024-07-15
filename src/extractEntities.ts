import { Entities, Entity } from './types/entities';
import db from './config/db';
import { sanitizeSearchTerm } from './utils/misc';
import { transformCombinations } from './utils/transformCombinations';


export async function extractEntities(searchTerm: string): Promise<Entities[]> {
  // Sanitize the search term to avoid issues with special characters
  const sanitizedSearchTerm = sanitizeSearchTerm(searchTerm);

  // Split the search term into individual words for full-text search
  const searchWords = sanitizedSearchTerm.split(/\s+/).map(word => `${word}:*`);

  // Organize the results into entities
  const foundEntities: { [key: string]: Entity[] } = {
    city: [],
    brand: [],
    dishType: [],
    diet: [],
  };

  for (const word of searchWords) {
    // Single SQL query to search for each word in searchTerm
    const query = `SELECT 'city' as type, id, name
                   FROM cities
                   WHERE to_tsvector('english', name) @@ to_tsquery($1)
                   UNION ALL
                   SELECT 'brand' as type, id, name
                   FROM brands
                   WHERE to_tsvector('english', name) @@ to_tsquery($1)
                   UNION ALL
                   SELECT 'dishType' as type, id, name
                   FROM dish_types
                   WHERE to_tsvector('english', name) @@ to_tsquery($1)
                   UNION ALL
                   SELECT 'diet' as type, id, name
                   FROM diets
                   WHERE to_tsvector('english', name) @@ to_tsquery($1)`;

    const results = await db.any(query, [word]);

    for (const row of results) {
      foundEntities[row.type].push({ id: row.id, name: row.name, searchWord: word });
    }
  }

  // Generate all possible combinations of the entities
  const combinations: Entities[] = [];

  const cities = foundEntities.city.length > 0 ? foundEntities.city : [undefined];
  const brands = foundEntities.brand.length > 0 ? foundEntities.brand : [undefined];
  const dishTypes = foundEntities.dishType.length > 0 ? foundEntities.dishType : [undefined];
  const diets = foundEntities.diet.length > 0 ? foundEntities.diet : [undefined];

  cities.forEach(city => {
    brands.forEach(brand => {
      dishTypes.forEach(dishType => {
        diets.forEach(diet => {
          const entity: Entities = {
            ...(city && { city }),
            ...(brand && { brand }),
            ...(dishType && { dishType }),
            ...(diet && { diet }),
          };

          // Only add combination if it has at least one entity
          if (Object.keys(entity).length > 0) {
            combinations.push(entity);
          }
        });
      });
    });
  });

  return transformCombinations(combinations);
}
