export const getAllCategoriesQuery = `SELECT * FROM categories;`;
export const getAllGroupsQuery = `SELECT * FROM groups;`;
export const getAllActiveGalleryItems = `SELECT * FROM gallery where active is true;`;
export const getAllActiveNews = `SELECT * FROM news where active is true;`;
export const getAllActiveSliderItems = `SELECT * FROM slider where active is true;`;

export const getAllItemsByGroupId = (
  groupId: number,
  start?: number,
  end?: number
) => {
  return `SELECT * FROM items where category_id in (SELECT given_id from categories where group_id = ${groupId})
    ${
      start != undefined
        ? `offset(${start}) 
    ${end != undefined ? `limit(${end})` : ""}`
        : ""
    }`;
};
