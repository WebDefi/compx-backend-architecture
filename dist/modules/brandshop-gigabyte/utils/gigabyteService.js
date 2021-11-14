"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../../dataSource/db"));
const DBConfig_1 = require("../../../dataSource/db/DBConfig");
const crudUtils_1 = require("../../utils/crudUtils");
const dbQueries_1 = require("./dbQueries");
class gigabyteService {
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllCategoriesQuery, DBConfig_1.compxDB.id);
        });
    }
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllGroupsQuery, DBConfig_1.compxDB.id);
        });
    }
    createGroup(title, text, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title: title,
                image_url: image,
                group_text: text,
            };
            const { queryString, valuesArray } = crudUtils_1.constructCreateQueryStringBasedOnParams("groups", objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    editGroup(id, title, text, active_text, active_button, image, banner_image_url) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title: title,
                image_url: image,
                group_text: text,
                banner_active_text: active_text,
                banner_active_button: active_button,
                banner_image_url: banner_image_url,
            };
            const { queryString, valuesArray } = crudUtils_1.constructUpdateQueryStringBasedOnParams("groups", id, objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    createNewsSales(table, title, active, url, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title: title,
                image: imageUrl,
                url: url,
                active: active,
            };
            const { queryString, valuesArray } = crudUtils_1.constructCreateQueryStringBasedOnParams(table, objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    editNewsSales(table, id, title, active, url, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title: title,
                image: imageUrl,
                url: url,
                active: active,
            };
            const { queryString, valuesArray } = crudUtils_1.constructUpdateQueryStringBasedOnParams(table, id, objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    createSliderElement(title_high, title_low, button_text, url_to, active = false, active_title = false, active_button = false, image, image_mob) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title_high,
                title_low,
                button_text,
                url_to,
                active,
                active_title,
                active_button,
                image,
                image_mob,
            };
            const { queryString, valuesArray } = crudUtils_1.constructCreateQueryStringBasedOnParams("slider", objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    updatedSliderElement(id, title_high, title_low, button_text, url_to, active = false, active_title = false, active_button = false, image, image_mob) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectToInsert = {
                title_high,
                title_low,
                button_text,
                url_to,
                active,
                active_title,
                active_button,
                image,
                image_mob,
            };
            const { queryString, valuesArray } = crudUtils_1.constructUpdateQueryStringBasedOnParams("slider", id, objectToInsert);
            return yield db_1.default.executeQueryForGivenDB(queryString, DBConfig_1.compxDB.id, valuesArray);
        });
    }
    getBannerImageUrlByGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getBannerImageUrlByGroup(groupId), DBConfig_1.compxDB.id);
        });
    }
    getAllItemsGroupId(groupId, start, end, sort_by, charValues) {
        return __awaiter(this, void 0, void 0, function* () {
            let charValuesString = "";
            let categories = [];
            if (charValues && groupId != 8) {
                charValues.forEach((value) => {
                    charValuesString += `'${value}', `;
                });
                charValuesString = charValuesString.substring(0, charValuesString.length - 2);
            }
            if (groupId == 8) {
                if (charValues) {
                    let categoriesNames = {
                        Миші: 1165,
                        Гарнітура: 1170,
                        СВО: 1154,
                        "Системи охолдження процесору": 1151,
                    };
                    for (let category in categoriesNames) {
                        if (charValues[0] == category) {
                            categories.push(categoriesNames[category]);
                        }
                    }
                }
            }
            console.log(dbQueries_1.getAllItemsByGroupId(groupId, start, end, sort_by, charValues && (groupId != 8) != undefined
                ? charValuesString
                : undefined, categories.length > 0 ? categories : undefined));
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllItemsByGroupId(groupId, start, end, sort_by, charValues && (groupId != 8) != undefined
                ? charValuesString
                : undefined, categories.length > 0 ? categories : undefined), DBConfig_1.compxDB.id);
        });
    }
    getNumberOfItemsByGroup(groupId, charValues) {
        return __awaiter(this, void 0, void 0, function* () {
            let charValuesString = "";
            if (charValues) {
                charValues.forEach((value) => {
                    charValuesString += `'${value}', `;
                });
                charValuesString = charValuesString.substring(0, charValuesString.length - 2);
            }
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getCountOfItemsByGroupAndChars(groupId, charValues != undefined ? charValuesString : undefined), DBConfig_1.compxDB.id);
        });
    }
    getDistinctCharacteristicsForGivenGroupId(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getDistinctCharacteristicsForGivenGroupId(groupId), DBConfig_1.compxDB.id);
        });
    }
    getAllActiveGalleryItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllActiveGalleryItems, DBConfig_1.compxDB.id);
        });
    }
    getGalleryItemByGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getGalleryItemByGroup(groupId), DBConfig_1.compxDB.id);
        });
    }
    deleteRecordById(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.deleteFromTableRecord(table, id), DBConfig_1.compxDB.id);
        });
    }
    getUserByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getUserByName(username), DBConfig_1.compxDB.id);
        });
    }
    getAllActiveNews() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllActiveNews, DBConfig_1.compxDB.id);
        });
    }
    getAllActiveSales() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllActiveSales, DBConfig_1.compxDB.id);
        });
    }
    getAllActiveSliderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getAllActiveSliderItems, DBConfig_1.compxDB.id);
        });
    }
    getFpsItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.executeQueryForGivenDB(dbQueries_1.getFpsItems, DBConfig_1.compxDB.id);
        });
    }
}
exports.default = new gigabyteService();
