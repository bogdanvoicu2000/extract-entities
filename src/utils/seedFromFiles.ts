import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import db from '../config/db';

async function loadCsvData(filePath: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const results: string[][] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(Object.values(data)))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function seedDatabase() {
  const dataDir = path.join(__dirname, '../data');

  const cityData = await loadCsvData(path.join(dataDir, 'cities.csv'));
  const brandData = await loadCsvData(path.join(dataDir, 'brands.csv'));
  const dishTypeData = await loadCsvData(path.join(dataDir, 'dish_types.csv'));
  const dietData = await loadCsvData(path.join(dataDir, 'diets.csv'));

  // Clear existing data
  await db.none('TRUNCATE cities, brands, dish_types, diets RESTART IDENTITY');

  // Insert new data
  const insertCity = 'INSERT INTO cities (name) VALUES ($1)';
  const insertBrand = 'INSERT INTO brands (name) VALUES ($1)';
  const insertDishType = 'INSERT INTO dish_types (name) VALUES ($1)';
  const insertDiet = 'INSERT INTO diets (name) VALUES ($1)';

  for (const row of cityData) {
    await db.none(insertCity, [row[1]]);
  }
  for (const row of brandData) {
    await db.none(insertBrand, [row[1]]);
  }
  for (const row of dishTypeData) {
    await db.none(insertDishType, [row[1]]);
  }
  for (const row of dietData) {
    await db.none(insertDiet, [row[1]]);
  }
  console.log('Database seeded successfully');
}

seedDatabase().catch(err => console.error('Error seeding database:', err));
