import db from ".";
import { compxDB } from "./DBConfig";

export const initRemoteDatabase = async () => {
  const initRemoteDBQuery = `
        CREATE TABLE IF NOT EXISTS categories (
            id serial,
            given_id integer UNIQUE,
            name varchar(50)
        );
        CREATE TABLE IF NOT EXISTS items (
            id serial,
            category_id int references categories (given_id),
            name varchar(50),
            description text,
            url text,
            image text,
            price decimal,
            detailedDescRU text,
            detailedDescUA text
        )
    `;
  const createTablesResponse = await db.executeQueryForGivenDB(
    initRemoteDBQuery,
    compxDB.id
  );
  if (createTablesResponse.error) {
    console.log(createTablesResponse);
  }
};
