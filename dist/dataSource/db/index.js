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
const dbs = __importStar(require("./DBConfig"));
const drivers_1 = require("./DBConfig/dbTypes/drivers");
const pg_1 = require("pg");
class DBHelper {
    executeQueryForGivenDB(query, dbId, values = []
    // stream: boolean = false
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getDBbyId(dbId);
            let executedQuery;
            if (db.driver == drivers_1.DBDrivers.pg) {
                executedQuery = yield this.runCompxQuery(query, db, values);
            }
            return executedQuery;
        });
    }
    runCompxQuery(query, db, values = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = new pg_1.Pool({
                user: db.user,
                host: db.host,
                database: db.name,
                password: db.pass,
                port: 5432,
            });
            const client = yield pool.connect();
            try {
                const result = yield client.query(query, values);
                // client.release()
                return result;
            }
            catch (error) {
                console.log(error);
                return { error };
            }
            finally {
                client.release();
            }
        });
    }
    getDBbyId(id) {
        return Object.values(dbs).find((db) => db.id === id) || dbs.compxDB;
    }
}
exports.default = new DBHelper();
