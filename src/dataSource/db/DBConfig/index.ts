import { compxDb } from "./dbTypes/db1";
import { DBDrivers } from "./dbTypes/drivers";

// All examples are invalid

export const compxDB: compxDb = {
  id: 1,
  user: "postgres",
  host: "gigabyte.cdx0k9wdxtet.eu-west-1.rds.amazonaws.com",
  port: 5432,
  pass: "K:%YDhUYe`?5_D`J",
  name: "compx_brandshop",
  driver: DBDrivers.pg,
  userAccessible: true,
};
