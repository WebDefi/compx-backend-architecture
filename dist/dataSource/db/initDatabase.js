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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRemoteDatabase = void 0;
const _1 = __importDefault(require("."));
const DBConfig_1 = require("./DBConfig");
const initRemoteDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const initRemoteDBQuery = `
        CREATE TABLE IF NOT EXISTS groups (
          id serial unique,
          title varchar(256),
          image_url text,
          banner_image_url text
        );
        CREATE TABLE IF NOT EXISTS char_group (
          id serial unique,
          groupId int references groups(id),
          characteristics json[]
      );
        CREATE TABLE IF NOT EXISTS categories (
            id serial,
            given_id integer UNIQUE,
            name varchar(50),
            group_id int references groups(id)
        );
        CREATE TABLE IF NOT EXISTS items (
            id serial,
            category_id int references categories (given_id),
            name varchar(50),
            description text,
            url text,
            images text[],
            price decimal,
            detailedDescRU text,
            detailedDescUA text
        );
        CREATE TABLE IF NOT EXISTS gallery (
          id serial unique,
          images text[]
        );
        CREATE TABLE IF NOT EXISTS news (
          id serial unique,
          image text,
          url text,
          title varchar(265)
        );
        CREATE TABLE IF NOT EXISTS sale_promotion (
          id serial unique,
          image text,
          url text,
          title varchar(265)
        );
        CREATE TABLE IF NOT EXISTS slider (
          id serial unique,
          image text,
          title_high varchar(50),
          title_low text,
          button_text varchar(50),
          active boolean,
          active_button boolean,
          active_title boolean
        );
    `;
    const createTablesResponse = yield _1.default.executeQueryForGivenDB(initRemoteDBQuery, DBConfig_1.compxDB.id);
    if (createTablesResponse.error) {
        console.log(createTablesResponse);
    }
});
exports.initRemoteDatabase = initRemoteDatabase;
