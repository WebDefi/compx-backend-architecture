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
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
class Brandshop {
    parseXml(xmlData, constructor) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedXml = yield xml2js_1.parseStringPromise(xmlData, {
                explicitArray: false,
            });
            // console.log(parsedXml)
            let categories = this.filterObjectByProperties(parsedXml.price.categories.category, constructor.category);
            let categoriesObj = {};
            categories.forEach((category) => {
                categoriesObj[category.id] = category.name;
            });
            let items = this.filterObjectByProperties(parsedXml.price.items.item, constructor.item);
            return { categories: categoriesObj, items };
        });
    }
    filterObjectByProperties(obj, properties) {
        return obj.map((elem) => {
            let tempResult = {};
            for (let property in properties) {
                if (properties[property]) {
                    tempResult[property] = elem[property];
                }
            }
            return tempResult;
        });
    }
}
exports.default = new Brandshop();
