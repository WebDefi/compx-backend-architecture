"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = exports.opts = void 0;
const authenticationHook_1 = require("./authenticationHook");
const controller = __importStar(require("./controller"));
exports.opts = {
    prefix: "/gigabyte/api/v1/",
};
exports.routes = [
    {
        method: "GET",
        url: "/groups",
        handler: controller.getGroups,
    },
    {
        method: "POST",
        url: "/groups",
        handler: controller.createGroup,
    },
    {
        method: "PUT",
        url: "/groups/:id",
        handler: controller.editGroup,
    },
    {
        method: "GET",
        url: "/items/:groupId",
        handler: controller.getItemsByGroup,
    },
    {
        method: "GET",
        url: "/gallery",
        handler: controller.getGalleryItems,
    },
    {
        method: "GET",
        url: "/gallery/:groupId",
        handler: controller.getGalleryItemByGroup,
    },
    {
        method: "GET",
        url: "/news",
        handler: controller.getNews,
    },
    {
        method: "DELETE",
        url: "/news/:id",
        handler: controller.deleteNews,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "DELETE",
        url: "/slider/:id",
        handler: controller.deleteSlider,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "DELETE",
        url: "/sales/:id",
        handler: controller.deleteSales,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "POST",
        url: "/news",
        handler: controller.createNews,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "GET",
        url: "/sales",
        handler: controller.getSales,
    },
    {
        method: "POST",
        url: "/sales",
        handler: controller.createSales,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "PUT",
        url: "/sales/:id",
        handler: controller.editSales,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "PUT",
        url: "/news/:id",
        handler: controller.editNews,
        preValidation: authenticationHook_1.Authenticate,
    },
    {
        method: "GET",
        url: "/sales/:id",
        handler: controller.getSaleById,
    },
    {
        method: "GET",
        url: "/groups/:id",
        handler: controller.getGroupsById,
    },
    {
        method: "GET",
        url: "/news/:id",
        handler: controller.getNewsById,
    },
    {
        method: "GET",
        url: "/slider/:id",
        handler: controller.getSliderById,
    },
    {
        method: "PUT",
        url: "/slider/:id",
        handler: controller.editSlider,
    },
    {
        method: "GET",
        url: "/slider",
        handler: controller.getSlider,
    },
    {
        method: "POST",
        url: "/slider",
        handler: controller.createSlider,
    },
    {
        method: "GET",
        url: "/games/:groupId",
        handler: controller.getFpsGamesChars,
    },
    {
        method: "POST",
        url: "/login",
        handler: controller.loginUser,
    },
];
