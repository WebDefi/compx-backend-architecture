import db from ".";
import { compxDB } from "./DBConfig";

export const initRemoteDatabase = async () => {
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
  const createTablesResponse = await db.executeQueryForGivenDB(
    initRemoteDBQuery,
    compxDB.id
  );
  if (createTablesResponse.error) {
    console.log(createTablesResponse);
  }
};
