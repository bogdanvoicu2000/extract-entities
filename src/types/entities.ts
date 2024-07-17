export enum EntityEnum {
  CITY = 'city',
  BRAND = 'brand',
  DISH_TYPE = 'dishType',
  DIET = 'diet'
}

export type Entity = {
  id: number;
  name: string;
  searchWord?: string;
}

export type Entities = {
  [key in EntityEnum]?: Entity;
}