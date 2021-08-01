import { RouteOptions, RegisterOptions, RouteHandlerMethod } from "fastify";
import * as controller from "./controller";

export const opts: RegisterOptions = {
  prefix: "/gigabyte/api/v1/uploadData",
};

export const routes: RouteOptions[] = [
  {
    method: "POST",
    url: "/",
    handler: <RouteHandlerMethod>controller.uploadXmlData,
  },
];
