import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";
import { constructCreateQueryStringBasedOnParams } from "../../utils/crudUtils";
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
  getBannerImageUrlByGroup,
  getCountOfItemsByGroupAndChars,
  getFpsItems,
  getGalleryItemByGroup,
} from "./dbQueries";

class gigabyteService {
  public async getAllCategories() {
    return await db.executeQueryForGivenDB(getAllCategoriesQuery, compxDB.id);
  }
  public async getAllGroups() {
    return await db.executeQueryForGivenDB(getAllGroupsQuery, compxDB.id);
  }
  public async createGroup(title: string, text?: string, image?: string) {
    const objectToInsert: { [key: string]: any } = {
      title: title,
      image_url: image,
      group_text: text,
    };
    const { queryString, valuesArray } =
      constructCreateQueryStringBasedOnParams("groups", objectToInsert);
    return await db.executeQueryForGivenDB(
      queryString,
      compxDB.id,
      valuesArray
    );
  }
  public async createSliderElement(
    title_high?: string,
    title_low?: string,
    button_text?: string,
    url_to?: string,
    active: boolean = false,
    active_title: boolean = false,
    active_button: boolean = false,
    image?: string,
    image_mob?: string
  ) {
    const objectToInsert: { [key: string]: any } = {
      title_high,
      title_low,
      button_text,
      url_to,
      active,
      active_title,
      active_button,
      image,
      image_mob,
    };
    const { queryString, valuesArray } =
      constructCreateQueryStringBasedOnParams("slider", objectToInsert);
    return await db.executeQueryForGivenDB(
      queryString,
      compxDB.id,
      valuesArray
    );
  }
  public async getBannerImageUrlByGroup(groupId: number) {
    return await db.executeQueryForGivenDB(
      getBannerImageUrlByGroup(groupId),
      compxDB.id
    );
  }
  public async getAllItemsGroupId(
    groupId: number,
    start?: number,
    end?: number,
    sort_by?: string,
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
    return await db.executeQueryForGivenDB(
      getAllItemsByGroupId(
        groupId,
        start,
        end,
        sort_by,
        charValues != undefined ? charValuesString : undefined
      ),
      compxDB.id
    );
  }
  public async getNumberOfItemsByGroup(
    groupId: number,
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
    return await db.executeQueryForGivenDB(
      getCountOfItemsByGroupAndChars(
        groupId,
        charValues != undefined ? charValuesString : undefined
      ),
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
  public async getGalleryItemByGroup(groupId: number) {
    return await db.executeQueryForGivenDB(
      getGalleryItemByGroup(groupId),
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
  public async getFpsItems() {
    return await db.executeQueryForGivenDB(getFpsItems, compxDB.id);
  }
}

export default new gigabyteService();
