import { parseStringPromise } from "xml2js";

class Brandshop {
  public async parseXml(
    xmlData: Buffer,
    constructor: {
      category: { id: boolean; name: boolean };
      item: {
        id?: boolean;
        categoryId?: boolean;
        code?: boolean;
        vendor?: boolean;
        name?: boolean;
        description?: boolean;
        url?: boolean;
        image?: boolean;
        priceRUAH?: boolean;
        stock?: boolean;
        stockByCity?: boolean;
        guarantee?: boolean;
        condition?: boolean;
      };
    }
  ) {
    const parsedXml = await parseStringPromise(xmlData, {
      explicitArray: false,
    });
    let categories = this.filterObjectByProperties(
      parsedXml.price.categories.category,
      constructor.category
    );
    let categoriesObj: { [key: string]: any } = {};
    categories.forEach((category: any) => {
      categoriesObj[category.id] = category.name;
    });
    let items = this.filterObjectByProperties(
      parsedXml.price.items.item,
      constructor.item
    );
    return { categories: categoriesObj, items };
  }
  private filterObjectByProperties(obj: Array<any>, properties: any) {
    return obj.map((elem: any) => {
      let tempResult: { [key: string]: any } = {};
      for (let property in properties) {
        if (properties[property]) {
          tempResult[property] = elem[property];
        }
      }
      return tempResult;
    });
  }
}

export default new Brandshop();
