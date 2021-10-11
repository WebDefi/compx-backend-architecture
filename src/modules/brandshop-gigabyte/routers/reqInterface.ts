import { RequestBodyDefault, RequestHeadersDefault } from "fastify";
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

export interface RouteGenericInterfaceItemsByCategory
  extends RequestGenericInterface,
    ReplyGenericInterface {}
