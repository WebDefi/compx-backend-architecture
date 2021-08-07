import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";
import IServiceInterface from "../../utils/IServiceInterface";
import {
  getAllCategoriesQuery,
  getAllItemsByGroupId,
  getAllGroupsQuery,
  getAllActiveGalleryItems,
  getAllActiveNews,
  getAllActiveSliderItems,
} from "./dbQueries";

class gigabyteService {
  public async getAllCategories() {
    return await db.executeQueryForGivenDB(getAllCategoriesQuery, compxDB.id);
  }
  public async getAllGroups() {
    return await db.executeQueryForGivenDB(getAllGroupsQuery, compxDB.id);
  }
  public async getAllItemsGroupId(
    groupId: number,
    start?: number,
    end?: number
  ) {
    return await db.executeQueryForGivenDB(
      getAllItemsByGroupId(groupId, start, end),
      compxDB.id
    );
  }
  public async getAllActiveGalleryItems() {
    return await db.executeQueryForGivenDB(
      getAllActiveGalleryItems,
      compxDB.id
    );
  }
  public async getAllActiveNews() {
    return await db.executeQueryForGivenDB(getAllActiveNews, compxDB.id);
  }
  public async getAllActiveSliderItems() {
    return await db.executeQueryForGivenDB(getAllActiveSliderItems, compxDB.id);
  }
}

export default new gigabyteService();
