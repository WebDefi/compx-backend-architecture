import fastify from "fastify";
import cookie from "fastify-cookie";
import cors from "fastify-cors";
import * as gigabyte from "./modules/brandshop-gigabyte/routers";
import * as admin from "./modules/admin/routers";
import { Server } from "./Server/Server";

const server = new Server(fastify({ logger: true, bodyLimit: 10485760 }));

server.registerPlugin({ pluginInstance: cookie, options: { secret: "hehe" } });
server.registerPlugin({ pluginInstance: cors, options: { origin: true } });
server.registerRouter(gigabyte);
server.registerRouter(admin);

server.registerApi();

export default server;
