export const getAllCategoriesQuery = `SELECT * FROM categories;`;
export const getAllItemsByCategoryId = (
  categoryId: number,
  start?: number,
  end?: number
) => {
  return `SELECT * FROM items where category_id = ${categoryId}
    ${
      start != undefined
        ? `offset(${start}) 
    ${end != undefined ? `limit(${end})` : ""}`
        : ""
    }`;
};
