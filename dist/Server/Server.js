"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
class Server {
    constructor(server, routerSet, pluginSet) {
        this.setOfRouters = routerSet !== null && routerSet !== void 0 ? routerSet : [];
        this.setOfPlugins = pluginSet !== null && pluginSet !== void 0 ? pluginSet : [];
        this.serverInstace = server;
    }
    registerPlugin(plugin) {
        this.setOfPlugins.push(plugin);
    }
    registerRouter(router) {
        this.setOfRouters.push(router);
    }
    registerPlugins() {
        this.setOfPlugins.forEach((plugin) => {
            this.serverInstace.register(plugin.pluginInstance, plugin.options);
        });
    }
    registerRouters() {
        this.setOfRouters.forEach((router) => {
            let { routes, opts } = router;
            const plugin = (server, opts, done) => {
                routes.forEach((route) => server.route(route));
                done();
            };
            this.serverInstace.register(plugin, opts);
        });
    }
    registerApi() {
        this.registerPlugins();
        this.registerRouters();
    }
    initServer(port, host) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.serverInstace.listen(port, host);
        });
    }
}
exports.Server = Server;
