import {
  RequestBodyDefault,
  RequestHeadersDefault,
  RequestQuerystringDefault,
  RequestGenericInterface as RGI,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterface {
  Body?: RequestBodyDefault;
  Querystring?: RequestQuerystringDefault;
  Params: {
    aloha: string;
  };
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceHelloWorld
  extends RequestGenericInterface,
    ReplyGenericInterface {}
