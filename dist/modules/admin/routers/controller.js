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
exports.uploadXmlData = void 0;
const adminService_1 = __importDefault(require("../utils/adminService"));
const uploadXmlData = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        // const xmlFile = Buffer.from(req.body.xmlData, "base64");
        // const xmlData = await Brandshop.parseXml(xmlFile, {
        //   category: { id: true, name: true },
        //   item: {
        //     categoryId: true,
        //     name: true,
        //     description: true,
        //     url: true,
        //     images: true,
        //     priceRUAH: true,
        //     detailedDescriptionRU: true,
        //     detailedDescriptionUA: true,
        //     stock: true,
        //     characteristics: true,
        //     condition: true,
        //   },
        // });
        // xmlData.items.forEach((item: any) => console.log(item.characteristics.charItem));
        const insertData = yield adminService_1.default.createRecord(req.body);
        if (insertData.error) {
            return rep.status(400).send(insertData);
        }
        return rep.status(201).send(insertData);
    }
    catch (error) {
        return rep.status(400).send({ error });
    }
});
exports.uploadXmlData = uploadXmlData;
