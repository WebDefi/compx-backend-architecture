import {
  RequestBodyDefault,
  RequestHeadersDefault,
  RequestQuerystringDefault,
  RequestGenericInterface as RGI,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterface {
  Body?: RequestBodyDefault;
  Querystring?: {
    start: number;
    end?: number;
  };
  Params: {
    categoryId: number;
  };
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceItemsByCategory
  extends RequestGenericInterface,
    ReplyGenericInterface {}
