import { RouteOptions, RegisterOptions, RouteHandlerMethod } from "fastify";
import * as controller from "./controller";

export const opts: RegisterOptions = {
  prefix: "",
};

export const routes: RouteOptions[] = [
  {
    method: "GET",
    url: "/:aloha",
    handler: <RouteHandlerMethod>controller.helloWorld,
  },
];
