import { compxDb } from "./dbTypes/db1";
import { DBDrivers } from "./dbTypes/drivers";

// All examples are invalid

export const compxDB: compxDb = {
  id: 1,
  user: "User1",
  host: "localhost",
  port: 5432,
  pass: null,
  name: "db1Example",
  driver: DBDrivers.pg,
  userAccessible: true,
};
