import * as dbs from "./DBConfig";
import { dbConfig } from "./DBConfig/dbTypes";
import { db1 } from "./DBConfig/dbTypes/db1";
import { DBDrivers } from "./DBConfig/dbTypes/drivers";

class DBHelper {
  public async executeQueryForGivenDB(
    query: string,
    dbId: number,
    values: Array<string> = [],
    // stream: boolean = false
  ): Promise<any> {
    const db = this.getDBbyId(dbId);
    let executedQuery;
    if (db.driver == DBDrivers.db1) {
      executedQuery = await this.runDB1Query(query, db);
    } else if (db.driver == DBDrivers.db2) {
      executedQuery = await this.runDB2Query(query, db, values);
    }
    return executedQuery;
  }

  protected async runDB2Query(query: string, db: db1, values: Array<string> = []): Promise<any> {
    let connection;

    try {
      // connection = await db1.getConnection({
      //   user: db.user,
      //   password: db.pass
      // });
      // let result = await connection.execute(query);
      // return result;
    } catch (error) {
      console.error(error);
      return { error: error };
    } finally {
      if (connection) {
        try {
          // await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  protected async runDB1Query(query: string, db: db1): Promise<any> {
    let connection;

    try {
      // connection = await db1.getConnection({
      //   user: db.user,
      //   password: db.pass
      // });
      // let result = await connection.execute(query);
      // return result;
    } catch (error) {
      console.error(error);
      return { error: error };
    } finally {
      if (connection) {
        try {
          // await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  public getDBbyId(id: number): dbConfig {
    return Object.values(dbs).find((db) => db.id === id) || dbs.db1Example;
  }
}
export default new DBHelper();