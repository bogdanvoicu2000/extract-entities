export type Entity = {
  id: number;
  name: string;
  searchWord: string;
}

export type Entities = {
  brand?: Entity;
  city?: Entity;
  diet?: Entity;
  dishType?: Entity;
}