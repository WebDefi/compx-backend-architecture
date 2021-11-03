import { RouteOptions, RegisterOptions, RouteHandlerMethod } from "fastify";
import { Authenticate } from "./authenticationHook";
import * as controller from "./controller";

export const opts: RegisterOptions = {
  prefix: "/gigabyte/api/v1/",
};

export const routes: RouteOptions[] = [
  {
    method: "GET",
    url: "/groups",
    handler: <RouteHandlerMethod>controller.getGroups,
  },
  {
    method: "POST",
    url: "/groups",
    handler: <RouteHandlerMethod>controller.createGroup,
  },
  {
    method: "PUT",
    url: "/groups/:id",
    handler: <RouteHandlerMethod>controller.editGroup,
  },
  {
    method: "GET",
    url: "/items/:groupId",
    handler: <RouteHandlerMethod>controller.getItemsByGroup,
  },
  {
    method: "GET",
    url: "/gallery",
    handler: <RouteHandlerMethod>controller.getGalleryItems,
  },
  {
    method: "GET",
    url: "/gallery/:groupId",
    handler: <RouteHandlerMethod>controller.getGalleryItemByGroup,
  },
  {
    method: "GET",
    url: "/news",
    handler: <RouteHandlerMethod>controller.getNews,
  },
  {
    method: "DELETE",
    url: "/news/:id",
    handler: <RouteHandlerMethod>controller.deleteNews,
    preValidation: Authenticate,
  },
  {
    method: "DELETE",
    url: "/slider/:id",
    handler: <RouteHandlerMethod>controller.deleteSlider,
    preValidation: Authenticate,
  },
  {
    method: "DELETE",
    url: "/sales/:id",
    handler: <RouteHandlerMethod>controller.deleteSales,
    preValidation: Authenticate,
  },
  {
    method: "POST",
    url: "/news",
    handler: <RouteHandlerMethod>controller.createNews,
    preValidation: Authenticate,
  },
  {
    method: "GET",
    url: "/sales",
    handler: <RouteHandlerMethod>controller.getSales,
  },
  {
    method: "POST",
    url: "/sales",
    handler: <RouteHandlerMethod>controller.createSales,
    preValidation: Authenticate,
  },
  {
    method: "PUT",
    url: "/sales/:id",
    handler: <RouteHandlerMethod>controller.editSales,
    preValidation: Authenticate,
  },
  {
    method: "PUT",
    url: "/news/:id",
    handler: <RouteHandlerMethod>controller.editNews,
    preValidation: Authenticate,
  },
  {
    method: "GET",
    url: "/sales/:id",
    handler: <RouteHandlerMethod>controller.getSaleById,
  },
  {
    method: "GET",
    url: "/groups/:id",
    handler: <RouteHandlerMethod>controller.getGroupsById,
  },
  {
    method: "GET",
    url: "/news/:id",
    handler: <RouteHandlerMethod>controller.getNewsById,
  },
  {
    method: "GET",
    url: "/slider/:id",
    handler: <RouteHandlerMethod>controller.getSliderById,
  },
  {
    method: "PUT",
    url: "/slider/:id",
    handler: <RouteHandlerMethod>controller.editSlider,
  },
  {
    method: "GET",
    url: "/slider",
    handler: <RouteHandlerMethod>controller.getSlider,
  },
  {
    method: "POST",
    url: "/slider",
    handler: <RouteHandlerMethod>controller.createSlider,
  },
  {
    method: "GET",
    url: "/games/:groupId",
    handler: <RouteHandlerMethod>controller.getFpsGamesChars,
  },
  {
    method: "POST",
    url: "/login",
    handler: <RouteHandlerMethod>controller.loginUser,
  },
];
