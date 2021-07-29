import { RouteOptions, RegisterOptions, RouteHandlerMethod } from "fastify";
import * as controller from "./controller";

export const opts: RegisterOptions = {
  prefix: "/gigabyte/api/v1/",
};

export const routes: RouteOptions[] = [
  {
    method: "GET",
    url: "/categories",
    handler: <RouteHandlerMethod>controller.getCategories,
  },
  {
    method: "GET",
    url: "/items/:categoryId",
    handler: <RouteHandlerMethod>controller.getItemsByCategory,
  },
];
