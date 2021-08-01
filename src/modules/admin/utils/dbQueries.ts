export const insertIntoCategories = (values: string) => {
  return `insert into categories(given_id, name) VALUES ${values}`;
};

export const insertIntoItems = (values: string) => {
  return `insert into items (category_id, name, description, url, image, price, detailedDescRU, detailedDescUA) VALUES ${values}`;
};
