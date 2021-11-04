"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIntoItems = exports.insertIntoCategories = void 0;
const insertIntoCategories = (values) => {
    return `insert into categories(given_id, name) VALUES ${values}`;
};
exports.insertIntoCategories = insertIntoCategories;
const insertIntoItems = (values) => {
    return `insert into items (category_id, name, description, url, images, price, detailedDescRU, detailedDescUA, characteristics) VALUES ${values}`;
};
exports.insertIntoItems = insertIntoItems;
