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
  getAllActiveSales,
  getDistinctCharacteristicsForGivenGroupId,
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
    end?: number,
    charValues?: Array<string>
  ) {
    let charValuesString = "";
    if (charValues) {
      charValues.forEach((value: string) => {
        charValuesString += `'${value}', `;
      });
      charValuesString = charValuesString.substring(
        0,
        charValuesString.length - 2
      );
    }
    // console.log(getAllItemsByGroupId(groupId, start, end, charValuesString))
    return await db.executeQueryForGivenDB(
      getAllItemsByGroupId(groupId, start, end, charValuesString),
      compxDB.id
    );
  }
  public async getDistinctCharacteristicsForGivenGroupId(groupId: number) {
    return await db.executeQueryForGivenDB(
      getDistinctCharacteristicsForGivenGroupId(groupId),
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
  public async getAllActiveSales() {
    return await db.executeQueryForGivenDB(getAllActiveSales, compxDB.id);
  }
  public async getAllActiveSliderItems() {
    return await db.executeQueryForGivenDB(getAllActiveSliderItems, compxDB.id);
  }
}

export default new gigabyteService();
