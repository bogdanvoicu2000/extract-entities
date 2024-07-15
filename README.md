# Entity Extractor

This project implements an algorithm to extract entities such as cities, brands, dish types, and diets from a search
term.

## Prerequisites

- Node.js (v14 or higher)
- TypeScript
- PostgreSQL

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/bogdanvoicu2000/extract-entities.git
    cd extract-entities
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up PostgreSQL database:**
    - Create a new PostgreSQL database.
    - Update the database configuration in `src/config/db.ts` to match your database settings.

4. **Run database migrations:**
   run all queries from `0001_create_tables.sql`

5. **Seed the database:**
   run script `src/utils/seedFromFiles.ts`

## Usage

1. **Run the application:**
    ```bash
    npx ts-node src/index.ts search="McDonald’s in London or Manchester"
    ```
   You need to run the script with 'search="[search term]"' argument

## Project Structure

- **data:** Database seed files.
- **src/config/db.ts:** Database connection configuration.
- **src/types:** Type files.
- **src/utils/misc.ts:** Miscellaneous utility functions.
- **src/utils/seedFromFiles.ts:** The script for seeding database from csv files.
- **src/extractEntities.ts:** Main function to extract entities from a search term.

## Example

For the search term `McDonald’s in London or Manchester`, the output will be:

```json
[
  {
    city: { id: 1, name: 'London' },
    brand: { id: 4, name: "McDonald's" }
  },
  {
    city: { id: 6, name: 'Manchester' },
    brand: { id: 4, name: "McDonald's" }
  }
]
