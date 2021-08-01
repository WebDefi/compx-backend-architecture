import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";
import IServiceInterface from "../../utils/IServiceInterface";
import { getAllCategoriesQuery, getAllItemsByCategoryId } from "./dbQueries";

class gigabyteService {
  public async getAllCategories() {
    return db.executeQueryForGivenDB(getAllCategoriesQuery, compxDB.id);
  }
  public async getAllItemsByCategoryId(
    categoryId: number,
    start?: number,
    end?: number
  ) {
    return db.executeQueryForGivenDB(
      getAllItemsByCategoryId(categoryId, start, end),
      compxDB.id
    );
  }
}

export default new gigabyteService();
