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
const dbQueries_1 = require("./dbQueries");
class adminService {
    createRecord(brandShopData) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryInsertCategories = "";
            const categories = brandShopData.categories;
            // Object.keys(categories).forEach((categoryId: string) => {
            //   queryInsertCategories += `(${categoryId}, '${categories[categoryId]}'), `;
            // });
            categories.forEach((categoryObj) => {
                queryInsertCategories += `(${categoryObj.id}, '${categoryObj.name}'), `;
            });
            const queryToInsertCategories = dbQueries_1.insertIntoCategories(queryInsertCategories.substring(0, queryInsertCategories.length - 2));
            // console.log("Query to insert  categoriews")
            // console.log(queryToInsertCategories);
            // const insetrCategoriesResult = await db.executeQueryForGivenDB(
            //   queryToInsertCategories,
            //   compxDB.id
            // );
            // if (insetrCategoriesResult.error) {
            //   return insetrCategoriesResult;
            // }
            let queryInsertItems = "";
            let values = [];
            // brandShopData.items = [brandShopData.items[0]];
            const items = brandShopData.items
                .map((item) => {
                console.log(item.images);
                if (typeof item.images.image == "string") {
                    item.images = [item.images.image];
                }
                else {
                    item.images = item.images.map((imageObj) => imageObj.image);
                }
                if (item.condition == "NEW") {
                    item.characteristics = [
                        ...new Set(item.characteristics.map((char) => char.name)),
                    ].map((name) => {
                        let tempValues = item.characteristics.find((char) => char.name == name);
                        return {
                            name: name,
                            alias: tempValues.alias
                                .replace(/Видеокарты\.|Ноутбуки\.|Системы охлаждения\.|Материнские платы\.|SSD\.|Гарнитуры\.|Мыши\.|Монитор\.|Корпуса\.|Блоки питания\./, "")
                                .trim(),
                            value: tempValues.value,
                        };
                    });
                    return item;
                }
            })
                .filter((item) => item != undefined);
            // console.log(items.length)
            let counter = 0;
            items.forEach((item) => {
                queryInsertItems += `($${counter + 1}, $${counter + 2}, $${counter + 3}, $${counter + 4}, $${counter + 5}, $${counter + 6}, $${counter + 7}, $${counter + 8}, $${counter + 9}), `;
                values.push(...[
                    item.categoryId,
                    item.name,
                    item.description,
                    item.url,
                    item.images,
                    item.priceRUAH,
                    item.detailedDescriptionUA,
                    item.detailedDescriptionRU,
                    item.characteristics,
                ]);
                counter += 9;
            });
            const queryToInsertItems = dbQueries_1.insertIntoItems(queryInsertItems.substring(0, queryInsertItems.length - 2));
            // console.log(items);
            // console.log("QUery to inset");
            // console.log(queryToInsertItems);
            const dropItems = yield db_1.default.executeQueryForGivenDB("DELETE FROM items", DBConfig_1.compxDB.id);
            if (dropItems.error) {
                return dropItems;
            }
            const insertItemsResult = yield db_1.default.executeQueryForGivenDB(queryToInsertItems, DBConfig_1.compxDB.id, values);
            if (insertItemsResult.error) {
                return insertItemsResult;
            }
            return { result: "Data Inserted Successfully" };
        });
    }
    updateRecord(...args) {
        throw new Error("Method not implemented.");
    }
    deleteRecord(...args) {
        throw new Error("Method not implemented.");
    }
    getRecord(...args) {
        throw new Error("Method not implemented.");
    }
}
exports.default = new adminService();
