import * as dbs from "./DBConfig";
import { dbConfig } from "./DBConfig/dbTypes";
import { compxDb } from "./DBConfig/dbTypes/db1";
import { DBDrivers } from "./DBConfig/dbTypes/drivers";

class DBHelper {
  public async executeQueryForGivenDB(
    query: string,
    dbId: number,
    values: Array<string> = []
    // stream: boolean = false
  ): Promise<any> {
    const db = this.getDBbyId(dbId);
    let executedQuery;
    if (db.driver == DBDrivers.pg) {
      executedQuery = await this.runCompxQuery(query, db);
    }
    return executedQuery;
  }

  protected async runCompxQuery(query: string, db: compxDb): Promise<any> {
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
    return Object.values(dbs).find((db) => db.id === id) || dbs.compxDB;
  }
}
export default new DBHelper();
