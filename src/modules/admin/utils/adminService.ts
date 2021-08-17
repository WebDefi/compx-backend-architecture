import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";
import IServiceInterface from "../../utils/IServiceInterface";
import { insertIntoCategories, insertIntoItems } from "./dbQueries";

class adminService implements IServiceInterface {
  public async createRecord(brandShopData: {
    [key: string]: any;
  }): Promise<any> {
    let queryInsertCategories = "";
    const categories = brandShopData.categories;
    Object.keys(categories).forEach((categoryId: string) => {
      queryInsertCategories += `(${categoryId}, '${categories[categoryId]}'), `;
    });
    const queryToInsertCategories = insertIntoCategories(
      queryInsertCategories.substring(0, queryInsertCategories.length - 2)
    );
    // console.log("Query to insert  categoriews")
    // console.log(queryToInsertCategories);
    // const insetrCategoriesResult = await db.executeQueryForGivenDB(
    //   queryToInsertCategories,
    //   compxDB.id
    // );
    // if (insetrCategoriesResult.error) {
    //   return insetrCategoriesResult;
    // }
    let queryInsertItems = "";
    let values: Array<any> = [];
    const items = brandShopData.items.map((item: any) => {
      // console.log(item);
      if (typeof item.images.image == "string") {
        item.images.image = [item.images.image];
      }
      item.characteristics = item.characteristics.charItem
        ? item.characteristics.charItem.length
          ? item.characteristics.charItem.map((char: any) => {
              delete char["$"]["type"];
              return char["$"];
            })
          : [item.characteristics.charItem["$"]]
        : [];
      item.characteristics = [
        ...new Set(item.characteristics.map((char: any) => char.name)),
      ].map((name: any) => {
        let tempValues = item.characteristics.find(
          (char: any) => char.name == name
        );
        return {
          name: name,
          alias: tempValues.alias,
          value: tempValues.value,
        };
      });
      return item;
    });
    // console.log(items.length)
    let counter = 0;
    items.forEach((item: any) => {
      queryInsertItems += `($${counter + 1}, $${counter + 2}, $${
        counter + 3
      }, $${counter + 4}, $${counter + 5}, $${counter + 6}, $${counter + 7}, $${
        counter + 8
      }, $${counter + 9}), `;
      values.push(
        ...[
          item.categoryId,
          item.name,
          item.description,
          item.url,
          item.images.image,
          item.priceRUAH,
          item.detailedDescriptionUA,
          item.detailedDescriptionRU,
          item.characteristics,
        ]
      );
      counter += 9;
    });
    const queryToInsertItems = insertIntoItems(
      queryInsertItems.substring(0, queryInsertItems.length - 2)
    );
    // console.log("QUery to inset");
    // console.log(queryToInsertItems);
    const insertItemsResult = await db.executeQueryForGivenDB(
      queryToInsertItems,
      compxDB.id,
      values
    );
    if (insertItemsResult.error) {
      return insertItemsResult;
    }
    return { result: "Data Inserted Successfully" };
  }
  updateRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getRecord(...args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default new adminService();
