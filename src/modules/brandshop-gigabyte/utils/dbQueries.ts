export const getAllCategoriesQuery = `SELECT * FROM categories;`;
export const getAllGroupsQuery = `SELECT * FROM groups;`;
export const getAllActiveGalleryItems = `SELECT * FROM gallery where active is true;`;
export const getAllActiveNews = `SELECT * FROM news where active is true;`;
export const getAllActiveSales = `SELECT * FROM sale_promotion where active is true;`;
export const getAllActiveSliderItems = `SELECT * FROM slider where active is true;`;
export const getFpsItems = `select vg.name_ru, vg.name_uk, 
vg.picture_url, it.name, fps.attributes from video_game vg, items it, 
fps_attributes fps where it.video_game_id = vg.id and it.fps_attributes_id = fps.id`;

export const getGalleryItemByGroup = (groupId: number) =>
  `SELECT * FROM gallery where active is true and group_id = ${groupId}`;

export const getUserByName = (username: string) =>
  `SELECT * FROM users where username = '${username}'`;

export const deleteFromTableRecord = (table: string, id: number) =>
  `DELETE FROM ${table} WHERE id = ${id}`;

export const getAllItemsByGroupId = (
  groupId: number,
  start?: number,
  end?: number,
  sort_by?: string,
  charValues?: string
) => {
  return `with item as (SELECT unnest(characteristics) chars, id FROM items where category_id in (SELECT given_id from categories where group_id = ${groupId}))
  select distinct on (items.id, price) category_id, name, description, url, images, price, price_old, detailedDescRU, detailedDescUA, characteristics FROM items, item
  where item.id = items.id
  ${
    charValues != undefined
      ? `and item.chars ->> 'value' in (${charValues})`
      : ""
  }
  ${
    sort_by != undefined
      ? sort_by == "price_up"
        ? "order by price asc"
        : sort_by == "price_down"
        ? "order by price desc"
        : ""
      : ""
  } 
    ${
      start != undefined
        ? `offset(${start}) 
    ${end != undefined ? `limit(${end})` : ""}`
        : ""
    }`;
};
export const getDistinctCharacteristicsForGivenGroupId = (groupId: number) => {
  return `select characteristics from char_group where groupid = ${groupId}`;
};
export const getBannerImageUrlByGroup = (groupId: number) => {
  return `select banner_image_url from groups where id = ${groupId}`;
};
export const getCountOfItemsByGroupAndChars = (
  groupId: number,
  charValues?: string
) => {
  return `with item as (SELECT unnest(characteristics) chars, id FROM items where category_id in (SELECT given_id from categories where group_id = ${groupId}))
  select count(distinct items.id) number_of_items FROM items, item
  where item.id = items.id
  ${
    charValues != undefined
      ? `and item.chars ->> 'value' in (${charValues})`
      : ""
  }`;
};
