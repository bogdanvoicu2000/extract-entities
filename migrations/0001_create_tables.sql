CREATE TABLE cities
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE brands
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE dish_types
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE diets
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);


-- Add full-text search capabilities
CREATE INDEX cities_name_idx ON cities USING gin (to_tsvector('english', name));
CREATE INDEX brands_name_idx ON brands USING gin (to_tsvector('english', name));
CREATE INDEX dish_types_name_idx ON dish_types USING gin (to_tsvector('english', name));
CREATE INDEX diets_name_idx ON diets USING gin (to_tsvector('english', name));