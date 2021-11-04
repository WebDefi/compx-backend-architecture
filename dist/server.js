"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const gigabyte = __importStar(require("./modules/brandshop-gigabyte/routers"));
const admin = __importStar(require("./modules/admin/routers"));
const Server_1 = require("./Server/Server");
const server = new Server_1.Server(fastify_1.default({ logger: true, bodyLimit: 10485760 }));
server.registerPlugin({ pluginInstance: fastify_cookie_1.default, options: { secret: "hehe" } });
server.registerPlugin({ pluginInstance: fastify_cors_1.default, options: { origin: true } });
server.registerRouter(gigabyte);
server.registerRouter(admin);
server.registerApi();
exports.default = server;
