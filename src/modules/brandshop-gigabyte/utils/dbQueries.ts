export const getAllCategoriesQuery = `SELECT * FROM categories;`;
export const getAllGroupsQuery = `SELECT * FROM groups;`;
export const getAllActiveGalleryItems = `SELECT * FROM gallery where active is true;`;
export const getAllActiveNews = `SELECT * FROM news where active is true;`;
export const getAllActiveSales = `SELECT * FROM sale_promotion where active is true;`;
export const getAllActiveSliderItems = `SELECT * FROM slider where active is true;`;
export const getFpsItems = `select vg.name_ru, vg.name_uk, 
vg.picture_url, it.name, fps.attributes from video_game vg, items it, 
fps_attributes fps where it.video_game_id = vg.id and it.fps_attributes_id = fps.id`;

export const getAllItemsByGroupId = (
  groupId: number,
  start?: number,
  end?: number,
  charValues?: string
) => {
  return `with item as (SELECT unnest(characteristics) chars, id FROM items where category_id in (SELECT given_id from categories where group_id = ${groupId}))
  select distinct category_id, name, description, url, images, price, detailedDescRU, detailedDescUA FROM items, item
  where item.id = items.id
  ${
    charValues != undefined
      ? `and item.chars ->> 'value' in (${charValues})`
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
  select count(*) number_of_items FROM items, item
  where item.id = items.id
  ${
    charValues != undefined
      ? `and item.chars ->> 'value' in (${charValues})`
      : ""
  }`;
};
