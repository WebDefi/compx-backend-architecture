import * as dbs from "./DBConfig";
import { dbConfig } from "./DBConfig/dbTypes";
import { compxDb } from "./DBConfig/dbTypes/db1";
import { DBDrivers } from "./DBConfig/dbTypes/drivers";
import { Pool, types } from "pg";

class DBHelper {
  public async executeQueryForGivenDB(
    query: string,
    dbId: number,
    values: Array<any> = []
    // stream: boolean = false
  ): Promise<any> {
    const db = this.getDBbyId(dbId);
    let executedQuery;
    if (db.driver == DBDrivers.pg) {
      executedQuery = await this.runCompxQuery(query, db, values);
    }
    return executedQuery;
  }

  protected async runCompxQuery(
    query: string,
    db: compxDb,
    values: Array<string> = []
  ): Promise<any> {
    const pool = new Pool({
      user: db.user,
      host: db.host,
      database: db.name,
      password: db.pass,
      port: 5432,
    });
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      // client.release()
      return result;
    } catch (error) {
      console.log(error);
      return { error };
    } finally {
      client.release();
    }
  }

  public getDBbyId(id: number): dbConfig {
    return Object.values(dbs).find((db) => db.id === id) || dbs.compxDB;
  }
}
export default new DBHelper();
