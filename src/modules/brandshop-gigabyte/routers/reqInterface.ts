import {
  RequestBodyDefault,
  RequestHeadersDefault,
  RequestQuerystringDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterface {
  Body?: RequestBodyDefault;
  Querystring?: {
    start: number;
    end?: number;
    charValues?: Array<string>;
    sort_by?: string;
  };
  Params: {
    groupId: number;
  };
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceGames {
  Body?: RequestBodyDefault;
  Querystring?: RequestQuerystringDefault;
  Params: {
    groupId: number;
  };
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceItemsByCategory
  extends RequestGenericInterface,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceGamesByGroup
  extends RequestGenericInterfaceGames,
    ReplyGenericInterface {}
