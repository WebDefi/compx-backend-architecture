"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountOfItemsByGroupAndChars = exports.getBannerImageUrlByGroup = exports.getDistinctCharacteristicsForGivenGroupId = exports.getAllItemsByGroupId = exports.deleteFromTableRecord = exports.getUserByName = exports.getGalleryItemByGroup = exports.getFpsItems = exports.getAllActiveSliderItems = exports.getAllActiveSales = exports.getAllActiveNews = exports.getAllActiveGalleryItems = exports.getAllGroupsQuery = exports.getAllCategoriesQuery = void 0;
exports.getAllCategoriesQuery = `SELECT * FROM categories;`;
exports.getAllGroupsQuery = `SELECT * FROM groups;`;
exports.getAllActiveGalleryItems = `SELECT * FROM gallery where active is true;`;
exports.getAllActiveNews = `SELECT * FROM news where active is true;`;
exports.getAllActiveSales = `SELECT * FROM sale_promotion where active is true;`;
exports.getAllActiveSliderItems = `SELECT * FROM slider where active is true;`;
exports.getFpsItems = `select vg.name_ru, vg.name_uk, 
vg.picture_url, it.name, fps.attributes from video_game vg, items it, 
fps_attributes fps where it.video_game_id = vg.id and it.fps_attributes_id = fps.id`;
const getGalleryItemByGroup = (groupId) => `SELECT * FROM gallery where active is true and group_id = ${groupId}`;
exports.getGalleryItemByGroup = getGalleryItemByGroup;
const getUserByName = (username) => `SELECT * FROM users where username = '${username}'`;
exports.getUserByName = getUserByName;
const deleteFromTableRecord = (table, id) => `DELETE FROM ${table} WHERE id = ${id}`;
exports.deleteFromTableRecord = deleteFromTableRecord;
const getAllItemsByGroupId = (groupId, start, end, sort_by, charValues, categories) => {
    return `with item as (SELECT unnest(characteristics) chars, id FROM items where category_id in (${categories
        ? `${categories[0]}`
        : `SELECT given_id from categories where group_id = ${groupId}`}))
  select distinct on (items.id, price) category_id, name, description, url, images, price, price_old, detailedDescRU, detailedDescUA, characteristics FROM items, item
  where item.id = items.id
  ${charValues != undefined && !categories
        ? `and item.chars ->> 'value' in (${charValues})`
        : ""}
  ${sort_by != undefined
        ? sort_by == "price_up"
            ? "order by price asc"
            : sort_by == "price_down"
                ? "order by price desc"
                : ""
        : ""} 
    ${start != undefined
        ? `offset(${start}) 
    ${end != undefined ? `limit(${end})` : ""}`
        : ""}`;
};
exports.getAllItemsByGroupId = getAllItemsByGroupId;
const getDistinctCharacteristicsForGivenGroupId = (groupId) => {
    return `select characteristics from char_group where groupid = ${groupId}`;
};
exports.getDistinctCharacteristicsForGivenGroupId = getDistinctCharacteristicsForGivenGroupId;
const getBannerImageUrlByGroup = (groupId) => {
    return `select banner_image_url from groups where id = ${groupId}`;
};
exports.getBannerImageUrlByGroup = getBannerImageUrlByGroup;
const getCountOfItemsByGroupAndChars = (groupId, charValues) => {
    return `with item as (SELECT unnest(characteristics) chars, id FROM items where category_id in (SELECT given_id from categories where group_id = ${groupId}))
  select count(distinct items.id) number_of_items FROM items, item
  where item.id = items.id
  ${charValues != undefined
        ? `and item.chars ->> 'value' in (${charValues})`
        : ""}`;
};
exports.getCountOfItemsByGroupAndChars = getCountOfItemsByGroupAndChars;
