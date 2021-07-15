import fastify from "fastify";
import cookie from "fastify-cookie";
import * as helloWorldModule from "./modules/brandshop-gigabyte/routers";
import { Server } from "./Server/Server";

const server = new Server(fastify({ logger: true }));

server.registerPlugin({ pluginInstance: cookie, options: { secret: "hehe" } });
server.registerRouter(helloWorldModule);

server.registerApi();

export default server;
