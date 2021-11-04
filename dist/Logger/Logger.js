"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() {
        this.config = process.env.ENV || "dev";
    }
    debug(msg) {
        this.logger
            ? null
            : console.debug("\x1b[34m", `${new Date().toISOString().split("T")[0]} - ${msg}`, "\x1b[0m");
    }
    info(msg) {
        this.logger
            ? null
            : console.info("\x1b[33m", `${new Date().toISOString().split("T")[0]} - ${msg}`, "\x1b[0m");
    }
    log(msg) {
        this.logger
            ? null
            : console.log("\x1b[37m", `${new Date().toISOString().split("T")[0]} - ${msg}`, "\x1b[0m");
    }
    error(msg) {
        this.logger
            ? null
            : console.error("\x1b[31m", `${new Date().toISOString().split("T")[0]} - ${msg}`, "\x1b[0m");
    }
}
exports.default = new Logger();
