"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralHook {
    applyHook(routes, hookMethodObj) {
        routes = routes.map((route) => {
            return Object.assign(Object.assign({}, route), hookMethodObj);
        });
        return routes;
    }
    applyGeneralHook1(routes) {
        return this.applyHook(routes, {
            preValidation: function (req, rep, done) {
                // console.log(req);
                done();
            },
        });
    }
}
exports.default = new GeneralHook();
