"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compxDB = void 0;
const drivers_1 = require("./dbTypes/drivers");
// All examples are invalid
exports.compxDB = {
    id: 1,
    user: "postgres",
    host: "gigabyte.cdx0k9wdxtet.eu-west-1.rds.amazonaws.com",
    port: 5432,
    pass: "K:%YDhUYe`?5_D`J",
    name: "compx_brandshop",
    driver: drivers_1.DBDrivers.pg,
    userAccessible: true,
};
