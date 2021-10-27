import { RouteOptions, RegisterOptions, RouteHandlerMethod } from "fastify";
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
    method: "GET",
    url: "/sales",
    handler: <RouteHandlerMethod>controller.getSales,
  },
  {
    method: "GET",
    url: "/slider",
    handler: <RouteHandlerMethod>controller.getSlider,
  },
  {
    method: "GET",
    url: "/games/:groupId",
    handler: <RouteHandlerMethod>controller.getFpsGamesChars,
  },
];
