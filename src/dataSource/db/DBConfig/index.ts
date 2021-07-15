import { db1 } from "./dbTypes/db1";
import { db2 } from "./dbTypes/db2";
import {DBDrivers} from "./dbTypes/drivers";

// All examples are invalid

export const db1Example: db1 = {
  id: 1,
  user: "User1",
  host: "localhost",
  port: 5432,
  pass: null,
  name: "db1Example",
  driver: DBDrivers.db1,
  userAccessible: true
};

export const db2Example: db2 = {
  id: 2,
  user: "User2",
  host: "localhost",
  port: 5434,
  pass: null,
  name: "db2Example",
  driver: DBDrivers.db2,
  userAccessible: true
};
