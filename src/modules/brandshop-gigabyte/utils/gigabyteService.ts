import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from "../../utils/crudUtils";
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
  deleteFromTableRecord,
  getUserByName,
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
  public async editGroup(
    id: number,
    title: string,
    text?: string,
    active_text?: boolean,
    active_button?: boolean,
    image?: string,
    banner_image_url?: string
  ) {
    const objectToInsert: { [key: string]: any } = {
      title: title,
      image_url: image,
      group_text: text,
      banner_active_text: active_text,
      banner_active_button: active_button,
      banner_image_url: banner_image_url,
    };
    const { queryString, valuesArray } =
      constructUpdateQueryStringBasedOnParams("groups", id, objectToInsert);
    return await db.executeQueryForGivenDB(
      queryString,
      compxDB.id,
      valuesArray
    );
  }
  public async createNewsSales(
    table: string,
    title: string,
    active: boolean,
    url: string,
    imageUrl: string
  ) {
    const objectToInsert: { [key: string]: any } = {
      title: title,
      image: imageUrl,
      url: url,
      active: active,
    };
    const { queryString, valuesArray } =
      constructCreateQueryStringBasedOnParams(table, objectToInsert);
    return await db.executeQueryForGivenDB(
      queryString,
      compxDB.id,
      valuesArray
    );
  }
  public async editNewsSales(
    table: string,
    id: number,
    title: string,
    active: boolean,
    url: string,
    imageUrl: string
  ) {
    const objectToInsert: { [key: string]: any } = {
      title: title,
      image: imageUrl,
      url: url,
      active: active,
    };
    const { queryString, valuesArray } =
      constructUpdateQueryStringBasedOnParams(table, id, objectToInsert);
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
  public async updatedSliderElement(
    id: number,
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
      constructUpdateQueryStringBasedOnParams("slider", id, objectToInsert);
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
    let categories = [];
    if (charValues && groupId != 8) {
      charValues.forEach((value: string) => {
        charValuesString += `'${value}', `;
      });
      charValuesString = charValuesString.substring(
        0,
        charValuesString.length - 2
      );
    }
    if (groupId == 8) {
      if (charValues) {
        let categoriesNames: any = {
          Миші: 1165,
          Гарнітура: 1170,
          СВО: 1154,
          "Системи охолдження процесору": 1151,
        };
        for (let category in categoriesNames) {
          if (charValues[0] == category) {
            categories.push(categoriesNames[category]);
          }
        }
      }
    }
    console.log(
      getAllItemsByGroupId(
        groupId,
        start,
        end,
        sort_by,
        charValues && (groupId != 8) != undefined
          ? charValuesString
          : undefined,
        categories.length > 0 ? categories : undefined
      )
    );
    return await db.executeQueryForGivenDB(
      getAllItemsByGroupId(
        groupId,
        start,
        end,
        sort_by,
        charValues && (groupId != 8) != undefined
          ? charValuesString
          : undefined,
        categories.length > 0 ? categories : undefined
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
  public async deleteRecordById(table: string, id: number) {
    return await db.executeQueryForGivenDB(
      deleteFromTableRecord(table, id),
      compxDB.id
    );
  }
  public async getUserByName(username: string) {
    return await db.executeQueryForGivenDB(getUserByName(username), compxDB.id);
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
