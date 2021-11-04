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
exports.getFpsGamesChars = exports.getSlider = exports.getSales = exports.getNews = exports.getGalleryItemByGroup = exports.getGalleryItems = exports.getItemsByGroup = exports.editSlider = exports.deleteSlider = exports.createSlider = exports.loginUser = exports.deleteSales = exports.deleteNews = exports.getSliderById = exports.getNewsById = exports.getGroupsById = exports.getSaleById = exports.editNews = exports.editGroup = exports.editSales = exports.createSales = exports.createNews = exports.createGroup = exports.getGroups = void 0;
const fileUtils_1 = require("../../aws/fileUtils");
const gigabyteService_1 = __importDefault(require("../utils/gigabyteService"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const db_1 = __importDefault(require("../../../dataSource/db"));
const DBConfig_1 = require("../../../dataSource/db/DBConfig");
const getGroups = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield gigabyteService_1.default.getAllGroups();
    if (groups.error) {
        return rep.status(400).send(groups);
    }
    const resultGroups = groups.rows.map((group) => {
        let tempImage = group.image_url;
        let tempImageGroup = group["banner_image_url"];
        delete group["image_url"];
        delete group["banner_image_url"];
        group["imageUrl"] = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${group.id}/${tempImage !== null && tempImage !== void 0 ? tempImage : ""}`;
        group["banner_image_url"] = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${group.id}/${tempImageGroup !== null && tempImageGroup !== void 0 ? tempImageGroup : ""}`;
        return group;
    });
    return rep.status(200).send({ groups: resultGroups });
});
exports.getGroups = getGroups;
const createGroup = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body.Image[0].rawFile);
    // console.log(req.body)
    const fileData = req.body.imageUrl;
    console.log(Buffer.from(fileData.src, "base64"));
    const createGroupResponse = yield gigabyteService_1.default.createGroup(req.body.title, req.body.text, fileData.title);
    if (createGroupResponse.error) {
        return rep.status(400).send(createGroupResponse);
    }
    fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `groups/${createGroupResponse.rows[0].id}/${fileData.title}`);
    return rep.status(201).send(createGroupResponse.rows[0]);
});
exports.createGroup = createGroup;
const createNews = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log(req.body.Image[0].rawFile);
    // console.log(req.body)
    const fileData = req.body.imageUrl;
    // console.log(Buffer.from(fileData.src, "base64"));
    const createNewsResponse = yield gigabyteService_1.default.createNewsSales("news", req.body.title, (_a = req.body.active) !== null && _a !== void 0 ? _a : false, (_b = req.body.url) !== null && _b !== void 0 ? _b : "", fileData.title);
    if (createNewsResponse.error) {
        return rep.status(400).send(createNewsResponse);
    }
    fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `news/${createNewsResponse.rows[0].id}/${fileData.title}`);
    createNewsResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${createNewsResponse.rows[0].id}/${createNewsResponse.rows[0].image}`;
    return rep.status(201).send(createNewsResponse.rows[0]);
});
exports.createNews = createNews;
const createSales = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // console.log(req.body.Image[0].rawFile);
    // console.log(req.body)
    const fileData = req.body.imageUrl;
    // console.log(Buffer.from(fileData.src, "base64"));
    const createSalesResponse = yield gigabyteService_1.default.createNewsSales("sale_promotion", req.body.title, (_c = req.body.active) !== null && _c !== void 0 ? _c : false, (_d = req.body.url) !== null && _d !== void 0 ? _d : "", fileData.title);
    if (createSalesResponse.error) {
        return rep.status(400).send(createSalesResponse);
    }
    fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `sales/${createSalesResponse.rows[0].id}/${fileData.title}`);
    createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
    return rep.status(201).send(createSalesResponse.rows[0]);
});
exports.createSales = createSales;
const editSales = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    console.log(req.body);
    const fileData = req.body.imageUrl;
    const createSalesResponse = yield gigabyteService_1.default.editNewsSales("sale_promotion", req.params.id, req.body.title, (_e = req.body.active) !== null && _e !== void 0 ? _e : false, (_f = req.body.url) !== null && _f !== void 0 ? _f : "", fileData ? fileData.title : undefined);
    if (createSalesResponse.error) {
        return rep.status(400).send(createSalesResponse);
    }
    if (fileData) {
        fileUtils_1.deleteFile(`sales/${req.params.id}/${fileData.title}`);
        fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `sales/${createSalesResponse.rows[0].id}/${fileData.title}`);
    }
    createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
    return rep.status(201).send(createSalesResponse.rows[0]);
});
exports.editSales = editSales;
const editGroup = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    console.log(req.body);
    const fileData = req.body.imageUrl;
    const fileDataBanner = req.body.imageUrlBanner;
    const createSalesResponse = yield gigabyteService_1.default.editGroup(req.params.id, req.body.title, (_g = req.body.group_text) !== null && _g !== void 0 ? _g : "", fileData ? fileData.title : undefined, fileDataBanner ? fileDataBanner.title : undefined);
    if (createSalesResponse.error) {
        return rep.status(400).send(createSalesResponse);
    }
    if (fileData) {
        fileUtils_1.deleteFile(`groups/${req.params.id}/${fileData.title}`);
        fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `groups/${createSalesResponse.rows[0].id}/${fileData.title}`);
    }
    if (fileDataBanner) {
        fileUtils_1.deleteFile(`groups/${req.params.id}/${fileDataBanner.title}`);
        fileUtils_1.uploadFile(Buffer.from(fileDataBanner.src.split(",")[1], "base64"), `groups/${createSalesResponse.rows[0].id}/${fileDataBanner.title}`);
    }
    createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image_url}`;
    return rep.status(201).send(createSalesResponse.rows[0]);
});
exports.editGroup = editGroup;
const editNews = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    console.log(req.body);
    const fileData = req.body.imageUrl;
    const createSalesResponse = yield gigabyteService_1.default.editNewsSales("news", req.params.id, req.body.title, (_h = req.body.active) !== null && _h !== void 0 ? _h : false, (_j = req.body.url) !== null && _j !== void 0 ? _j : "", fileData ? fileData.title : undefined);
    if (createSalesResponse.error) {
        return rep.status(400).send(createSalesResponse);
    }
    if (fileData) {
        fileUtils_1.deleteFile(`news/${req.params.id}/${fileData.title}`);
        fileUtils_1.uploadFile(Buffer.from(fileData.src.split(",")[1], "base64"), `news/${createSalesResponse.rows[0].id}/${fileData.title}`);
    }
    createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
    return rep.status(201).send(createSalesResponse.rows[0]);
});
exports.editNews = editNews;
const getSaleById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    let getSaleByIdResult = (yield db_1.default.executeQueryForGivenDB(`SELECT * FROM sale_promotion where id = ${req.params.id}`, DBConfig_1.compxDB.id)).rows[0];
    getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
    return rep.status(201).send(getSaleByIdResult);
});
exports.getSaleById = getSaleById;
const getGroupsById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    let getSaleByIdResult = (yield db_1.default.executeQueryForGivenDB(`SELECT * FROM groups where id = ${req.params.id}`, DBConfig_1.compxDB.id)).rows[0];
    getSaleByIdResult.image_url = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${getSaleByIdResult.id}/${getSaleByIdResult.image_url}`;
    getSaleByIdResult.banner_image_url = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${getSaleByIdResult.id}/${getSaleByIdResult.banner_image_url}`;
    return rep.status(201).send(getSaleByIdResult);
});
exports.getGroupsById = getGroupsById;
const getNewsById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    let getSaleByIdResult = (yield db_1.default.executeQueryForGivenDB(`SELECT * FROM news where id = ${req.params.id}`, DBConfig_1.compxDB.id)).rows[0];
    getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
    return rep.status(201).send(getSaleByIdResult);
});
exports.getNewsById = getNewsById;
const getSliderById = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    let getSaleByIdResult = (yield db_1.default.executeQueryForGivenDB(`SELECT * FROM slider where id = ${req.params.id}`, DBConfig_1.compxDB.id)).rows[0];
    getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
    getSaleByIdResult.image_mob = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${getSaleByIdResult.id}/${getSaleByIdResult.image_mob}`;
    return rep.status(201).send(getSaleByIdResult);
});
exports.getSliderById = getSliderById;
const deleteNews = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteNewsResponse = yield gigabyteService_1.default.deleteRecordById("news", // add deletion of photo in storage
    req.params.id);
    if (deleteNewsResponse.error) {
        return rep.status(400).send(deleteNewsResponse);
    }
    return rep.status(200).send({});
});
exports.deleteNews = deleteNews;
const deleteSales = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteNewsResponse = yield gigabyteService_1.default.deleteRecordById("sale_promotion", // add deletion of photo in storage
    req.params.id);
    if (deleteNewsResponse.error) {
        return rep.status(400).send(deleteNewsResponse);
    }
    return rep.status(200).send({});
});
exports.deleteSales = deleteSales;
const loginUser = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const getUserRecord = yield gigabyteService_1.default.getUserByName(username);
    if (getUserRecord.error) {
        return rep.status(400).send(getUserRecord);
    }
    if (bcrypt_1.compare(password, getUserRecord.rows[0].password)) {
        return rep.status(200).send({
            auth: jsonwebtoken_1.sign({ username }, "clownDoesBeepBeep", { expiresIn: "30d" }),
        });
    }
    else {
        return rep.status(401).send({ error: "unauthorize" });
    }
});
exports.loginUser = loginUser;
const createSlider = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m, _o, _p, _q, _r;
    // console.log(req.body.Image[0].rawFile);
    console.log(req.body);
    const fileDataDesc = req.body.imageUrlDesc;
    const fileDataMob = req.body.imageUrlMob;
    // console.log(Buffer.from(fileData.src, "base64"));
    const createSliderResponse = yield gigabyteService_1.default.createSliderElement((_k = req.body.title_high) !== null && _k !== void 0 ? _k : undefined, (_l = req.body.title_low) !== null && _l !== void 0 ? _l : undefined, (_m = req.body.button_text) !== null && _m !== void 0 ? _m : undefined, (_o = req.body.url_to) !== null && _o !== void 0 ? _o : undefined, (_p = req.body.active) !== null && _p !== void 0 ? _p : undefined, (_q = req.body.active_title) !== null && _q !== void 0 ? _q : undefined, (_r = req.body.active_button) !== null && _r !== void 0 ? _r : undefined, fileDataDesc ? fileDataDesc.title : undefined, fileDataMob ? fileDataMob.title : undefined);
    if (createSliderResponse.error) {
        return rep.status(400).send(createSliderResponse);
    }
    fileUtils_1.uploadFile(Buffer.from(fileDataDesc.src.split(",")[1], "base64"), `slider/${createSliderResponse.rows[0].id}/${fileDataDesc.title}`);
    fileUtils_1.uploadFile(Buffer.from(fileDataMob.src.split(",")[1], "base64"), `slider/${createSliderResponse.rows[0].id}/${fileDataMob.title}`);
    return rep.status(201).send(createSliderResponse.rows[0]);
});
exports.createSlider = createSlider;
const deleteSlider = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteNewsResponse = yield gigabyteService_1.default.deleteRecordById("slider", // add deletion of photo in storage
    req.params.id);
    if (deleteNewsResponse.error) {
        return rep.status(400).send(deleteNewsResponse);
    }
    return rep.status(200).send({});
});
exports.deleteSlider = deleteSlider;
const editSlider = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _s, _t, _u, _v, _w, _x, _y;
    // console.log(req.body.Image[0].rawFile);
    console.log(req.body);
    const fileDataDesc = req.body.imageUrlDesc;
    const fileDataMob = req.body.imageUrlMob;
    // console.log(Buffer.from(fileData.src, "base64"));
    const createSliderResponse = yield gigabyteService_1.default.updatedSliderElement(req.params.id, (_s = req.body.title_high) !== null && _s !== void 0 ? _s : undefined, (_t = req.body.title_low) !== null && _t !== void 0 ? _t : undefined, (_u = req.body.button_text) !== null && _u !== void 0 ? _u : undefined, (_v = req.body.url_to) !== null && _v !== void 0 ? _v : undefined, (_w = req.body.active) !== null && _w !== void 0 ? _w : undefined, (_x = req.body.active_title) !== null && _x !== void 0 ? _x : undefined, (_y = req.body.active_button) !== null && _y !== void 0 ? _y : undefined, fileDataDesc ? fileDataDesc.title : undefined, fileDataMob ? fileDataMob.title : undefined);
    if (createSliderResponse.error) {
        return rep.status(400).send(createSliderResponse);
    }
    if (fileDataDesc) {
        let deleteSliderItem = req.body.image.split("/");
        fileUtils_1.deleteFile(`slider/${req.params.id}/${deleteSliderItem[deleteSliderItem.length - 1]}`);
        fileUtils_1.uploadFile(Buffer.from(fileDataDesc.src.split(",")[1], "base64"), `slider/${createSliderResponse.rows[0].id}/${fileDataDesc.title}`);
    }
    if (fileDataMob) {
        let deleteSliderItemMob = req.body.image_mob.split("/");
        fileUtils_1.deleteFile(`slider/${req.params.id}/${deleteSliderItemMob[deleteSliderItemMob.length - 1]}`);
        fileUtils_1.uploadFile(Buffer.from(fileDataMob.src.split(",")[1], "base64"), `slider/${createSliderResponse.rows[0].id}/${fileDataMob.title}`);
    }
    return rep.status(201).send(createSliderResponse.rows[0]);
});
exports.editSlider = editSlider;
const getItemsByGroup = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    var _z, _0;
    const queryString = req.query;
    const charValues = queryString === null || queryString === void 0 ? void 0 : queryString.charValues;
    const groupId = req.params.groupId;
    if (!groupId)
        return rep.status(400).send({ error: "Group id wasn't presented" });
    const itemsResponse = yield gigabyteService_1.default.getAllItemsGroupId(groupId, queryString === null || queryString === void 0 ? void 0 : queryString.start, queryString === null || queryString === void 0 ? void 0 : queryString.end, queryString === null || queryString === void 0 ? void 0 : queryString.sort_by, charValues != undefined ? JSON.parse(decodeURI(charValues)) : undefined);
    if (itemsResponse.error) {
        return rep.status(400).send(itemsResponse);
    }
    let filteredItems = itemsResponse.rows
        .map((item) => {
        let tempOldPrice = item.price_old;
        delete item["price_old"];
        item.oldPrice = tempOldPrice;
        if (charValues != undefined) {
            let tempChars = item.characteristics;
            let tempCharValues = tempChars.map((char) => char.value);
            if (JSON.parse(decodeURI(charValues)).every((value) => tempCharValues.includes(value))) {
                return item;
            }
        }
        else {
            return item;
        }
    })
        .filter((elem) => elem != undefined);
    // filteredItems = Object.values(
    //   filteredItems.reduce((a: any, b: any) => {
    //     if (!a[b.name]) a[b.name] = b;
    //     return a;
    //   }, {})
    // );
    // console.log(filteredItems.length);
    const itemCharacteristics = yield gigabyteService_1.default.getDistinctCharacteristicsForGivenGroupId(groupId);
    if (itemCharacteristics.error) {
        return rep.status(400).send(itemCharacteristics);
    }
    const groupBanner = yield gigabyteService_1.default.getBannerImageUrlByGroup(groupId);
    if (groupBanner.error) {
        return rep.status(400).send(groupBanner);
    }
    const numberOfItems = yield gigabyteService_1.default.getNumberOfItemsByGroup(groupId, charValues != undefined ? JSON.parse(decodeURI(charValues)) : undefined);
    if (numberOfItems.error) {
        return rep.status(400).send(numberOfItems);
    }
    let itemCharacteristicsObject = {};
    itemCharacteristics.rows.forEach((char) => {
        if (itemCharacteristicsObject[char["name"]]) {
            itemCharacteristicsObject[char["name"]].values.push(char.value);
        }
        else {
            itemCharacteristicsObject[char["name"]] = {
                alias: char.alias,
                values: [char.value],
            };
        }
    });
    const numberOfPages = Math.round(numberOfItems.rows[0].number_of_items / 20);
    const itemsResult = {
        items: filteredItems,
        characteristics: (_z = itemCharacteristics.rows[0]) === null || _z === void 0 ? void 0 : _z.characteristics,
        bannerImageUrl: `https://compx-filestore.s3.eu-west-1.amazonaws.com/${(_0 = groupBanner.rows[0].banner_image_url) !== null && _0 !== void 0 ? _0 : ""}`,
        numberOfPages: numberOfPages == 0 ? 1 : numberOfPages,
        numberOfItems: numberOfItems.rows[0].number_of_items,
    };
    return rep.status(200).send(itemsResult);
});
exports.getItemsByGroup = getItemsByGroup;
const getGalleryItems = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const galleryItems = yield gigabyteService_1.default.getAllActiveGalleryItems();
    if (galleryItems.error) {
        return rep.status(400).send(galleryItems);
    }
    const resultGallery = galleryItems.rows.map((item) => {
        item.images = item.images.map((imageUrl) => `https://compx-filestore.s3.eu-west-1.amazonaws.com/${imageUrl}`);
        return item;
    });
    return rep.status(200).send({ gallery: resultGallery });
});
exports.getGalleryItems = getGalleryItems;
const getGalleryItemByGroup = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const galleryItem = yield gigabyteService_1.default.getGalleryItemByGroup(groupId);
    if (galleryItem.error) {
        return rep.status(400).send(galleryItem);
    }
    const resultGallery = galleryItem.rows.map((item) => {
        item.images = item.images.map((imageUrl) => `https://compx-filestore.s3.eu-west-1.amazonaws.com/${imageUrl}`);
        return item;
    });
    return rep
        .status(200)
        .send({ galleryItem: resultGallery.length < 1 ? null : resultGallery[0] });
});
exports.getGalleryItemByGroup = getGalleryItemByGroup;
const getNews = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const newsItems = yield gigabyteService_1.default.getAllActiveNews();
    if (newsItems.error) {
        return rep.status(400).send(newsItems);
    }
    const resultNewsItems = newsItems.rows.map((item) => {
        item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${item.id}/${item.image}`;
        return item;
    });
    return rep.status(200).send({ news: resultNewsItems });
});
exports.getNews = getNews;
const getSales = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const salesItems = yield gigabyteService_1.default.getAllActiveSales();
    if (salesItems.error) {
        return rep.status(400).send(salesItems);
    }
    const resultSalesItems = salesItems.rows.map((item) => {
        item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${item.id}/${item.image}`;
        return item;
    });
    return rep.status(200).send({ sales: resultSalesItems });
});
exports.getSales = getSales;
const getSlider = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const sliderItems = yield gigabyteService_1.default.getAllActiveSliderItems();
    if (sliderItems.error) {
        return rep.status(400).send(sliderItems);
    }
    const resultSliderItems = sliderItems.rows.map((item) => {
        item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${item.id}/${item.image}`;
        item.image_mob = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${item.id}/${item.image_mob}`;
        return item;
    });
    return rep.status(200).send({ slider: resultSliderItems });
});
exports.getSlider = getSlider;
const getFpsGamesChars = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    // const fpsItems: any = await gigabyteService.getFpsItems();
    // if (fpsItems.error) {
    //   return rep.status(400).send(fpsItems);
    // }
    return rep.status(200).send(req.params.groupId == 2
        ? {
            games: [
                {
                    videoGameName: "CYBERPUNK 2077",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/Cyberpunk_2077.71d10fd3.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 123,
                                    "ray tracing": 70,
                                    "ray tracing+DLSS quality": 86,
                                    "ray tracing+DLSS balance": 87,
                                    "ray tracing+DLSS performance": 88,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 114,
                                    "ray tracing": 67,
                                    "ray tracing+DLSS quality": 84,
                                    "ray tracing+DLSS balance": 85,
                                    "ray tracing+DLSS performance": 86,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 87,
                                    "ray tracing": 50,
                                    "ray tracing+DLSS quality": 77,
                                    "ray tracing+DLSS balance": 82,
                                    "ray tracing+DLSS performance": 86,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 87,
                                    "ray tracing": 42,
                                    "ray tracing+DLSS quality": 68,
                                    "ray tracing+DLSS balance": 76,
                                    "ray tracing+DLSS performance": 85,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 111,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 99,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 69,
                                },
                            },
                        ],
                        "2k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 47,
                                    "ray tracing": 77,
                                    "ray tracing+DLSS quality": 82,
                                    "ray tracing+DLSS balance": 86,
                                    "ray tracing+DLSS performance": 93,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 69,
                                    "ray tracing": 78,
                                    "ray tracing+DLSS quality": 83,
                                    "ray tracing+DLSS balance": 86,
                                    "ray tracing+DLSS performance": 42,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 65,
                                    "ray tracing": 30,
                                    "ray tracing+DLSS quality": 54,
                                    "ray tracing+DLSS balance": 62,
                                    "ray tracing+DLSS performance": 72,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 57,
                                    "ray tracing": 21,
                                    "ray tracing+DLSS quality": 47,
                                    "ray tracing+DLSS balance": 54,
                                    "ray tracing+DLSS performance": 64,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 78,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 67,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 42,
                                },
                            },
                        ],
                        "4k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 43,
                                    "ray tracing": 49,
                                    "ray tracing+DLSS quality": 59,
                                    "ray tracing+DLSS balance": 48,
                                    "ray tracing+DLSS performance": 23,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 45,
                                    "ray tracing": 53,
                                    "ray tracing+DLSS quality": 42,
                                    "ray tracing+DLSS balance": 19,
                                    "ray tracing+DLSS performance": 38,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 32,
                                    "ray tracing": 11,
                                    "ray tracing+DLSS quality": 21,
                                    "ray tracing+DLSS balance": 32,
                                    "ray tracing+DLSS performance": 39,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 28,
                                    "ray tracing": 6,
                                    "ray tracing+DLSS quality": 20,
                                    "ray tracing+DLSS balance": 23,
                                    "ray tracing+DLSS performance": 28,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 38,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 33,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 20,
                                },
                            },
                        ],
                    },
                },
                {
                    videoGameName: "Immortals Fenyx Rising",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/Immortals_Fenyx_Rising.9ae60098.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 114,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 111,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 98,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 98,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 114,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 114,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 97,
                                },
                            },
                        ],
                        "2k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 105,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 97,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 83,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 83,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 112,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 110,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 75,
                                },
                            },
                        ],
                        "4k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 78,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 72,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 58,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 59,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 78,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 67,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 46,
                                },
                            },
                        ],
                    },
                },
                {
                    videoGameName: "COD COLD WAR",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/COD_CLOD_WAR.52436a2d.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 192,
                                    "ray tracing": 109,
                                    "ray tracing+DLSS quality": 117,
                                    "ray tracing+DLSS balance": 119,
                                    "ray tracing+DLSS performance": 123,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 175,
                                    "ray tracing": 100,
                                    "ray tracing+DLSS quality": 113,
                                    "ray tracing+DLSS balance": 115,
                                    "ray tracing+DLSS performance": 119,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 145,
                                    "ray tracing": 85,
                                    "ray tracing+DLSS quality": 100,
                                    "ray tracing+DLSS balance": 103,
                                    "ray tracing+DLSS performance": 105,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 124,
                                    "ray tracing+DLSS balance": 91,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 175,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 60,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 111,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                                fpsAttrs: {
                                    DX: 83,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                                fpsAttrs: {
                                    DX: 74,
                                },
                            },
                        ],
                        "2k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 145,
                                    "ray tracing": 90,
                                    "ray tracing+DLSS quality": 107,
                                    "ray tracing+DLSS balance": 109,
                                    "ray tracing+DLSS performance": 113,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 129,
                                    "ray tracing": 78,
                                    "ray tracing+DLSS quality": 96,
                                    "ray tracing+DLSS balance": 101,
                                    "ray tracing+DLSS performance": 106,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 105,
                                    "ray tracing": 64,
                                    "ray tracing+DLSS quality": 82,
                                    "ray tracing+DLSS balance": 87,
                                    "ray tracing+DLSS performance": 93,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 86,
                                    "ray tracing+DLSS balance": 76,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 127,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 44,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 75,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                                fpsAttrs: {
                                    DX: 60,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                                fpsAttrs: {
                                    DX: 56,
                                },
                            },
                        ],
                        "4k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 85,
                                    "ray tracing": 55,
                                    "ray tracing+DLSS quality": 79,
                                    "ray tracing+DLSS balance": 87,
                                    "ray tracing+DLSS performance": 95,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 75,
                                    "ray tracing": 47,
                                    "ray tracing+DLSS quality": 70,
                                    "ray tracing+DLSS balance": 77,
                                    "ray tracing+DLSS performance": 84,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 55,
                                    "ray tracing": 30,
                                    "ray tracing+DLSS quality": 49,
                                    "ray tracing+DLSS balance": 60,
                                    "ray tracing+DLSS performance": 65,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 47,
                                    "ray tracing+DLSS balance": 46,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 74,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 28,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                                fpsAttrs: {
                                    DX: 38,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                                fpsAttrs: {
                                    DX: 33,
                                },
                            },
                            {
                                videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                                fpsAttrs: {
                                    DX: 27,
                                },
                            },
                        ],
                    },
                },
                {
                    videoGameName: "Assassin's Creed Valhalla",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/assassin's_creed_valhalla.f5537afd.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 97,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 92,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 82,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 81,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                                fpsAttrs: {
                                    DX: 82,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 77,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 55,
                                },
                            },
                        ],
                        "2k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 83,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 78,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 69,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 64,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                                fpsAttrs: {
                                    DX: 67,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 58,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 43,
                                },
                            },
                        ],
                        "4k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 58,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                                fpsAttrs: {
                                    DX: 54,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                                fpsAttrs: {
                                    DX: 47,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                                fpsAttrs: {
                                    DX: 41,
                                },
                            },
                            {
                                videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                                fpsAttrs: {
                                    DX: 44,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                                fpsAttrs: {
                                    DX: 35,
                                },
                            },
                            {
                                videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                                fpsAttrs: {
                                    DX: 21,
                                },
                            },
                        ],
                    },
                },
                {
                    videoGameName: "HITMAN 3",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/hitman3.b24f5e8e.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 222,
                                },
                            },
                        ],
                        "2k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 203,
                                },
                            },
                        ],
                        "4k": [
                            {
                                videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                                fpsAttrs: {
                                    DX: 123,
                                },
                            },
                        ],
                    },
                },
            ],
        }
        : {
            games: [
                {
                    videoGameName: "CYBERPUNK 2077",
                    videoGameImgUrl: "https://www.aorus.com/assets/img/Cyberpunk_2077.71d10fd3.jpg",
                    relatedItems: {
                        "1080": [
                            {
                                videoCardName: "Gigabyte AERO KD-72RU624SD (AERO15OLED_KD-72RU624SD",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/30d005e1e961b2874eb409b97c2a68ab/Product/28118/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 123,
                                    "ray tracing": 70,
                                    "ray tracing+DLSS quality": 86,
                                    "ray tracing+DLSS balance": 87,
                                    "ray tracing+DLSS performance": 88,
                                },
                            },
                            {
                                videoCardName: "AORUS 17.3 FHD 300Hz/Intel i7-11800H/16/512GB/NVD3060P-6/DOS",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/4d88cd80508c544adef1c58afaf3dcac/Product/28136/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 114,
                                    "ray tracing": 67,
                                    "ray tracing+DLSS quality": 84,
                                    "ray tracing+DLSS balance": 85,
                                    "ray tracing+DLSS performance": 86,
                                },
                            },
                            {
                                videoCardName: "Gigabyte G5 KC 15.6 FHD 144Hz/intel i5-10500H/16/512GB/NVD3060P-6/DOS",
                                videoCardPictureUrl: "https://static.gigabyte.com/StaticFile/Image/Global/30d005e1e961b2874eb409b97c2a68ab/Product/28118/webp/400",
                                fpsAttrs: {
                                    "No ray tracing": 87,
                                    "ray tracing": 50,
                                    "ray tracing+DLSS quality": 77,
                                    "ray tracing+DLSS balance": 82,
                                    "ray tracing+DLSS performance": 86,
                                },
                            },
                        ],
                        "2k": [],
                        "4k": [],
                    },
                },
            ],
        });
});
exports.getFpsGamesChars = getFpsGamesChars;
