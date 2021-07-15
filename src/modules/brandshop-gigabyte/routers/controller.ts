import { FastifyRequest, FastifyReply } from "fastify";
import { Logger } from "../../../Logger/Logger";
import { RouteGenericInterfaceHelloWorld } from "./reqInterface";

export const helloWorld = async (
  req: FastifyRequest<RouteGenericInterfaceHelloWorld>,
  rep: FastifyReply
) => {
  const params = req.params;
  const logger = new Logger();
  return rep.status(200).send("Hello World");
};
