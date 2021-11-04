import { FastifyRequest, FastifyReply } from "fastify";
import { deleteFile, uploadFile } from "../../aws/fileUtils";
import gigabyteService from "../utils/gigabyteService";
import {
  RouteGenericInterfaceGamesByGroup,
  RouteGenericInterfaceItemsByCategory,
} from "./reqInterface";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import db from "../../../dataSource/db";
import { compxDB } from "../../../dataSource/db/DBConfig";

export const getGroups = async (req: FastifyRequest, rep: FastifyReply) => {
  const groups = await gigabyteService.getAllGroups();
  if (groups.error) {
    return rep.status(400).send(groups);
  }
  const resultGroups = groups.rows.map((group: any) => {
    let tempImage = group.image_url;
    let tempImageGroup = group["banner_image_url"];
    delete group["image_url"];
    delete group["banner_image_url"];
    group[
      "imageUrl"
    ] = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${
      group.id
    }/${tempImage ?? ""}`;
    group[
      "banner_image_url"
    ] = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${
      group.id
    }/${tempImageGroup ?? ""}`;
    return group;
  });
  return rep.status(200).send({ groups: resultGroups });
};
export const createGroup = async (req: any, rep: FastifyReply) => {
  // console.log(req.body.Image[0].rawFile);
  // console.log(req.body)
  const fileData = req.body.imageUrl;
  console.log(Buffer.from(fileData.src, "base64"));
  const createGroupResponse = await gigabyteService.createGroup(
    req.body.title,
    req.body.text,
    fileData.title
  );
  if (createGroupResponse.error) {
    return rep.status(400).send(createGroupResponse);
  }
  uploadFile(
    Buffer.from(fileData.src.split(",")[1], "base64"),
    `groups/${createGroupResponse.rows[0].id}/${fileData.title}`
  );

  return rep.status(201).send(createGroupResponse.rows[0]);
};

export const createNews = async (req: any, rep: FastifyReply) => {
  // console.log(req.body.Image[0].rawFile);
  // console.log(req.body)
  const fileData = req.body.imageUrl;
  // console.log(Buffer.from(fileData.src, "base64"));
  const createNewsResponse = await gigabyteService.createNewsSales(
    "news",
    req.body.title,
    req.body.active ?? false,
    req.body.url ?? "",
    fileData.title
  );
  if (createNewsResponse.error) {
    return rep.status(400).send(createNewsResponse);
  }
  uploadFile(
    Buffer.from(fileData.src.split(",")[1], "base64"),
    `news/${createNewsResponse.rows[0].id}/${fileData.title}`
  );
  createNewsResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${createNewsResponse.rows[0].id}/${createNewsResponse.rows[0].image}`;
  return rep.status(201).send(createNewsResponse.rows[0]);
};

export const createSales = async (req: any, rep: FastifyReply) => {
  // console.log(req.body.Image[0].rawFile);
  // console.log(req.body)
  const fileData = req.body.imageUrl;
  // console.log(Buffer.from(fileData.src, "base64"));
  const createSalesResponse = await gigabyteService.createNewsSales(
    "sale_promotion",
    req.body.title,
    req.body.active ?? false,
    req.body.url ?? "",
    fileData.title
  );
  if (createSalesResponse.error) {
    return rep.status(400).send(createSalesResponse);
  }
  uploadFile(
    Buffer.from(fileData.src.split(",")[1], "base64"),
    `sales/${createSalesResponse.rows[0].id}/${fileData.title}`
  );
  createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
  return rep.status(201).send(createSalesResponse.rows[0]);
};

export const editSales = async (req: any, rep: FastifyReply) => {
  console.log(req.body);
  const fileData = req.body.imageUrl;
  const createSalesResponse = await gigabyteService.editNewsSales(
    "sale_promotion",
    req.params.id,
    req.body.title,
    req.body.active ?? false,
    req.body.url ?? "",
    fileData ? fileData.title : undefined
  );
  if (createSalesResponse.error) {
    return rep.status(400).send(createSalesResponse);
  }
  if (fileData) {
    deleteFile(`sales/${req.params.id}/${fileData.title}`);
    uploadFile(
      Buffer.from(fileData.src.split(",")[1], "base64"),
      `sales/${createSalesResponse.rows[0].id}/${fileData.title}`
    );
  }
  createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
  return rep.status(201).send(createSalesResponse.rows[0]);
};

export const editGroup = async (req: any, rep: FastifyReply) => {
  console.log(req.body);
  const fileData = req.body.imageUrl;
  const fileDataBanner = req.body.imageUrlBanner;
  const createSalesResponse = await gigabyteService.editGroup(
    req.params.id,
    req.body.title,
    req.body.group_text ?? "",
    fileData ? fileData.title : undefined,
    fileDataBanner ? fileDataBanner.title : undefined
  );
  if (createSalesResponse.error) {
    return rep.status(400).send(createSalesResponse);
  }
  if (fileData) {
    deleteFile(`groups/${req.params.id}/${fileData.title}`);
    uploadFile(
      Buffer.from(fileData.src.split(",")[1], "base64"),
      `groups/${createSalesResponse.rows[0].id}/${fileData.title}`
    );
  }
  if (fileDataBanner) {
    deleteFile(`groups/${req.params.id}/${fileDataBanner.title}`);
    uploadFile(
      Buffer.from(fileDataBanner.src.split(",")[1], "base64"),
      `groups/${createSalesResponse.rows[0].id}/${fileDataBanner.title}`
    );
  }
  createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image_url}`;
  return rep.status(201).send(createSalesResponse.rows[0]);
};

export const editNews = async (req: any, rep: FastifyReply) => {
  console.log(req.body);
  const fileData = req.body.imageUrl;
  const createSalesResponse = await gigabyteService.editNewsSales(
    "news",
    req.params.id,
    req.body.title,
    req.body.active ?? false,
    req.body.url ?? "",
    fileData ? fileData.title : undefined
  );
  if (createSalesResponse.error) {
    return rep.status(400).send(createSalesResponse);
  }
  if (fileData) {
    deleteFile(`news/${req.params.id}/${fileData.title}`);
    uploadFile(
      Buffer.from(fileData.src.split(",")[1], "base64"),
      `news/${createSalesResponse.rows[0].id}/${fileData.title}`
    );
  }
  createSalesResponse.rows[0].image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${createSalesResponse.rows[0].id}/${createSalesResponse.rows[0].image}`;
  return rep.status(201).send(createSalesResponse.rows[0]);
};

export const getSaleById = async (req: any, rep: FastifyReply) => {
  let getSaleByIdResult = (
    await db.executeQueryForGivenDB(
      `SELECT * FROM sale_promotion where id = ${req.params.id}`,
      compxDB.id
    )
  ).rows[0];
  getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
  return rep.status(201).send(getSaleByIdResult);
};
export const getGroupsById = async (req: any, rep: FastifyReply) => {
  let getSaleByIdResult = (
    await db.executeQueryForGivenDB(
      `SELECT * FROM groups where id = ${req.params.id}`,
      compxDB.id
    )
  ).rows[0];
  getSaleByIdResult.image_url = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${getSaleByIdResult.id}/${getSaleByIdResult.image_url}`;
  getSaleByIdResult.banner_image_url = `https://compx-filestore.s3.eu-west-1.amazonaws.com/groups/${getSaleByIdResult.id}/${getSaleByIdResult.banner_image_url}`;
  return rep.status(201).send(getSaleByIdResult);
};
export const getNewsById = async (req: any, rep: FastifyReply) => {
  let getSaleByIdResult = (
    await db.executeQueryForGivenDB(
      `SELECT * FROM news where id = ${req.params.id}`,
      compxDB.id
    )
  ).rows[0];
  getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
  return rep.status(201).send(getSaleByIdResult);
};

export const getSliderById = async (req: any, rep: FastifyReply) => {
  let getSaleByIdResult = (
    await db.executeQueryForGivenDB(
      `SELECT * FROM slider where id = ${req.params.id}`,
      compxDB.id
    )
  ).rows[0];
  getSaleByIdResult.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${getSaleByIdResult.id}/${getSaleByIdResult.image}`;
  getSaleByIdResult.image_mob = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${getSaleByIdResult.id}/${getSaleByIdResult.image_mob}`;
  return rep.status(201).send(getSaleByIdResult);
};

export const deleteNews = async (req: any, rep: FastifyReply) => {
  const deleteNewsResponse = await gigabyteService.deleteRecordById(
    "news", // add deletion of photo in storage
    req.params.id
  );
  if (deleteNewsResponse.error) {
    return rep.status(400).send(deleteNewsResponse);
  }
  return rep.status(200).send({});
};
export const deleteSales = async (req: any, rep: FastifyReply) => {
  const deleteNewsResponse = await gigabyteService.deleteRecordById(
    "sale_promotion", // add deletion of photo in storage
    req.params.id
  );
  if (deleteNewsResponse.error) {
    return rep.status(400).send(deleteNewsResponse);
  }
  return rep.status(200).send({});
};

export const loginUser = async (req: any, rep: FastifyReply) => {
  const username = req.body.username;
  const password = req.body.password;
  const getUserRecord = await gigabyteService.getUserByName(username);
  if (getUserRecord.error) {
    return rep.status(400).send(getUserRecord);
  }
  if (compare(password, getUserRecord.rows[0].password)) {
    return rep.status(200).send({
      auth: sign({ username }, process.env.JWTSecret!, { expiresIn: "30d" }),
    });
  } else {
    return rep.status(401).send({ error: "unauthorize" });
  }
};

export const createSlider = async (req: any, rep: FastifyReply) => {
  // console.log(req.body.Image[0].rawFile);
  console.log(req.body);
  const fileDataDesc = req.body.imageUrlDesc;
  const fileDataMob = req.body.imageUrlMob;
  // console.log(Buffer.from(fileData.src, "base64"));
  const createSliderResponse = await gigabyteService.createSliderElement(
    req.body.title_high ?? undefined,
    req.body.title_low ?? undefined,
    req.body.button_text ?? undefined,
    req.body.url_to ?? undefined,
    req.body.active ?? undefined,
    req.body.active_title ?? undefined,
    req.body.active_button ?? undefined,
    fileDataDesc ? fileDataDesc.title : undefined,
    fileDataMob ? fileDataMob.title : undefined
  );
  if (createSliderResponse.error) {
    return rep.status(400).send(createSliderResponse);
  }
  uploadFile(
    Buffer.from(fileDataDesc.src.split(",")[1], "base64"),
    `slider/${createSliderResponse.rows[0].id}/${fileDataDesc.title}`
  );
  uploadFile(
    Buffer.from(fileDataMob.src.split(",")[1], "base64"),
    `slider/${createSliderResponse.rows[0].id}/${fileDataMob.title}`
  );
  return rep.status(201).send(createSliderResponse.rows[0]);
};

export const deleteSlider = async (req: any, rep: FastifyReply) => {
  const deleteNewsResponse = await gigabyteService.deleteRecordById(
    "slider", // add deletion of photo in storage
    req.params.id
  );
  if (deleteNewsResponse.error) {
    return rep.status(400).send(deleteNewsResponse);
  }
  return rep.status(200).send({});
};

export const editSlider = async (req: any, rep: FastifyReply) => {
  // console.log(req.body.Image[0].rawFile);
  console.log(req.body);
  const fileDataDesc = req.body.imageUrlDesc;
  const fileDataMob = req.body.imageUrlMob;
  // console.log(Buffer.from(fileData.src, "base64"));
  const createSliderResponse = await gigabyteService.updatedSliderElement(
    req.params.id,
    req.body.title_high ?? undefined,
    req.body.title_low ?? undefined,
    req.body.button_text ?? undefined,
    req.body.url_to ?? undefined,
    req.body.active ?? undefined,
    req.body.active_title ?? undefined,
    req.body.active_button ?? undefined,
    fileDataDesc ? fileDataDesc.title : undefined,
    fileDataMob ? fileDataMob.title : undefined
  );
  if (createSliderResponse.error) {
    return rep.status(400).send(createSliderResponse);
  }
  if (fileDataDesc) {
    let deleteSliderItem = req.body.image.split("/");
    deleteFile(
      `slider/${req.params.id}/${deleteSliderItem[deleteSliderItem.length - 1]}`
    );
    uploadFile(
      Buffer.from(fileDataDesc.src.split(",")[1], "base64"),
      `slider/${createSliderResponse.rows[0].id}/${fileDataDesc.title}`
    );
  }
  if (fileDataMob) {
    let deleteSliderItemMob = req.body.image_mob.split("/");
    deleteFile(
      `slider/${req.params.id}/${
        deleteSliderItemMob[deleteSliderItemMob.length - 1]
      }`
    );
    uploadFile(
      Buffer.from(fileDataMob.src.split(",")[1], "base64"),
      `slider/${createSliderResponse.rows[0].id}/${fileDataMob.title}`
    );
  }
  return rep.status(201).send(createSliderResponse.rows[0]);
};

export const getItemsByGroup = async (
  req: FastifyRequest<RouteGenericInterfaceItemsByCategory>,
  rep: FastifyReply
) => {
  const queryString = req.query;
  const charValues: any = queryString?.charValues;
  const groupId = req.params.groupId;
  if (!groupId)
    return rep.status(400).send({ error: "Group id wasn't presented" });
  const itemsResponse = await gigabyteService.getAllItemsGroupId(
    groupId,
    queryString?.start,
    queryString?.end,
    queryString?.sort_by,
    charValues != undefined ? JSON.parse(decodeURI(charValues)) : undefined
  );
  if (itemsResponse.error) {
    return rep.status(400).send(itemsResponse);
  }
  let filteredItems = itemsResponse.rows
    .map((item: any) => {
      let tempOldPrice = item.price_old;
      delete item["price_old"];
      item.oldPrice = tempOldPrice;
      if (charValues != undefined) {
        let tempChars = item.characteristics;
        let tempCharValues = tempChars.map((char: any) => char.value);
        if (
          JSON.parse(decodeURI(charValues)).every((value: string) =>
            tempCharValues.includes(value)
          )
        ) {
          return item;
        }
      } else {
        return item;
      }
    })
    .filter((elem: any) => elem != undefined);
  // filteredItems = Object.values(
  //   filteredItems.reduce((a: any, b: any) => {
  //     if (!a[b.name]) a[b.name] = b;
  //     return a;
  //   }, {})
  // );
  // console.log(filteredItems.length);
  const itemCharacteristics =
    await gigabyteService.getDistinctCharacteristicsForGivenGroupId(groupId);
  if (itemCharacteristics.error) {
    return rep.status(400).send(itemCharacteristics);
  }
  const groupBanner = await gigabyteService.getBannerImageUrlByGroup(groupId);
  if (groupBanner.error) {
    return rep.status(400).send(groupBanner);
  }
  const numberOfItems = await gigabyteService.getNumberOfItemsByGroup(
    groupId,
    charValues != undefined ? JSON.parse(decodeURI(charValues)) : undefined
  );
  if (numberOfItems.error) {
    return rep.status(400).send(numberOfItems);
  }
  let itemCharacteristicsObject: any = {};
  itemCharacteristics.rows.forEach((char: any) => {
    if (itemCharacteristicsObject[char["name"]]) {
      itemCharacteristicsObject[char["name"]].values.push(char.value);
    } else {
      itemCharacteristicsObject[char["name"]] = {
        alias: char.alias,
        values: [char.value],
      };
    }
  });
  const numberOfPages = Math.round(numberOfItems.rows[0].number_of_items / 20);
  const itemsResult = {
    items: filteredItems,
    characteristics: itemCharacteristics.rows[0]?.characteristics,
    bannerImageUrl: `https://compx-filestore.s3.eu-west-1.amazonaws.com/${
      groupBanner.rows[0].banner_image_url ?? ""
    }`,
    numberOfPages: numberOfPages == 0 ? 1 : numberOfPages,
    numberOfItems: numberOfItems.rows[0].number_of_items,
  };
  return rep.status(200).send(itemsResult);
};

export const getGalleryItems = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const galleryItems: any = await gigabyteService.getAllActiveGalleryItems();
  if (galleryItems.error) {
    return rep.status(400).send(galleryItems);
  }
  const resultGallery = galleryItems.rows.map((item: any) => {
    item.images = item.images.map(
      (imageUrl: string) =>
        `https://compx-filestore.s3.eu-west-1.amazonaws.com/${imageUrl}`
    );
    return item;
  });
  return rep.status(200).send({ gallery: resultGallery });
};

export const getGalleryItemByGroup = async (
  req: FastifyRequest<RouteGenericInterfaceGamesByGroup>,
  rep: FastifyReply
) => {
  const groupId = req.params.groupId;
  const galleryItem: any = await gigabyteService.getGalleryItemByGroup(groupId);
  if (galleryItem.error) {
    return rep.status(400).send(galleryItem);
  }
  const resultGallery = galleryItem.rows.map((item: any) => {
    item.images = item.images.map(
      (imageUrl: string) =>
        `https://compx-filestore.s3.eu-west-1.amazonaws.com/${imageUrl}`
    );
    return item;
  });
  return rep
    .status(200)
    .send({ galleryItem: resultGallery.length < 1 ? null : resultGallery[0] });
};

export const getNews = async (req: FastifyRequest, rep: FastifyReply) => {
  const newsItems: any = await gigabyteService.getAllActiveNews();
  if (newsItems.error) {
    return rep.status(400).send(newsItems);
  }
  const resultNewsItems = newsItems.rows.map((item: any) => {
    item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/news/${item.id}/${item.image}`;
    return item;
  });
  return rep.status(200).send({ news: resultNewsItems });
};

export const getSales = async (req: FastifyRequest, rep: FastifyReply) => {
  const salesItems: any = await gigabyteService.getAllActiveSales();
  if (salesItems.error) {
    return rep.status(400).send(salesItems);
  }
  const resultSalesItems = salesItems.rows.map((item: any) => {
    item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/sales/${item.id}/${item.image}`;
    return item;
  });
  return rep.status(200).send({ sales: resultSalesItems });
};

export const getSlider = async (req: FastifyRequest, rep: FastifyReply) => {
  const sliderItems: any = await gigabyteService.getAllActiveSliderItems();
  if (sliderItems.error) {
    return rep.status(400).send(sliderItems);
  }
  const resultSliderItems = sliderItems.rows.map((item: any) => {
    item.image = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${item.id}/${item.image}`;
    item.image_mob = `https://compx-filestore.s3.eu-west-1.amazonaws.com/slider/${item.id}/${item.image_mob}`;
    return item;
  });
  return rep.status(200).send({ slider: resultSliderItems });
};

export const getFpsGamesChars = async (
  req: FastifyRequest<RouteGenericInterfaceGamesByGroup>,
  rep: FastifyReply
) => {
  // const fpsItems: any = await gigabyteService.getFpsItems();
  // if (fpsItems.error) {
  //   return rep.status(400).send(fpsItems);
  // }
  return rep.status(200).send(
    req.params.groupId == 2
      ? {
          games: [
            {
              videoGameName: "CYBERPUNK 2077",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/Cyberpunk_2077.71d10fd3.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 123,
                      "ray tracing": 70,
                      "ray tracing+DLSS quality": 86,
                      "ray tracing+DLSS balance": 87,
                      "ray tracing+DLSS performance": 88,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 114,
                      "ray tracing": 67,
                      "ray tracing+DLSS quality": 84,
                      "ray tracing+DLSS balance": 85,
                      "ray tracing+DLSS performance": 86,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 87,
                      "ray tracing": 50,
                      "ray tracing+DLSS quality": 77,
                      "ray tracing+DLSS balance": 82,
                      "ray tracing+DLSS performance": 86,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 87,
                      "ray tracing": 42,
                      "ray tracing+DLSS quality": 68,
                      "ray tracing+DLSS balance": 76,
                      "ray tracing+DLSS performance": 85,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 111,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 99,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 69,
                    },
                  },
                ],
                "2k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 47,
                      "ray tracing": 77,
                      "ray tracing+DLSS quality": 82,
                      "ray tracing+DLSS balance": 86,
                      "ray tracing+DLSS performance": 93,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 69,
                      "ray tracing": 78,
                      "ray tracing+DLSS quality": 83,
                      "ray tracing+DLSS balance": 86,
                      "ray tracing+DLSS performance": 42,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 65,
                      "ray tracing": 30,
                      "ray tracing+DLSS quality": 54,
                      "ray tracing+DLSS balance": 62,
                      "ray tracing+DLSS performance": 72,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 57,
                      "ray tracing": 21,
                      "ray tracing+DLSS quality": 47,
                      "ray tracing+DLSS balance": 54,
                      "ray tracing+DLSS performance": 64,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 78,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 67,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 42,
                    },
                  },
                ],
                "4k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 43,
                      "ray tracing": 49,
                      "ray tracing+DLSS quality": 59,
                      "ray tracing+DLSS balance": 48,
                      "ray tracing+DLSS performance": 23,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 45,
                      "ray tracing": 53,
                      "ray tracing+DLSS quality": 42,
                      "ray tracing+DLSS balance": 19,
                      "ray tracing+DLSS performance": 38,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 32,
                      "ray tracing": 11,
                      "ray tracing+DLSS quality": 21,
                      "ray tracing+DLSS balance": 32,
                      "ray tracing+DLSS performance": 39,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 28,
                      "ray tracing": 6,
                      "ray tracing+DLSS quality": 20,
                      "ray tracing+DLSS balance": 23,
                      "ray tracing+DLSS performance": 28,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 38,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 33,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 20,
                    },
                  },
                ],
              },
            },
            {
              videoGameName: "Immortals Fenyx Rising",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/Immortals_Fenyx_Rising.9ae60098.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 114,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 111,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 98,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 98,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 114,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 114,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 97,
                    },
                  },
                ],
                "2k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 105,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 97,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 83,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 83,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 112,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 110,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 75,
                    },
                  },
                ],
                "4k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 78,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 72,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 58,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 59,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 78,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 67,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 46,
                    },
                  },
                ],
              },
            },
            {
              videoGameName: "COD COLD WAR",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/COD_CLOD_WAR.52436a2d.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 192,
                      "ray tracing": 109,
                      "ray tracing+DLSS quality": 117,
                      "ray tracing+DLSS balance": 119,
                      "ray tracing+DLSS performance": 123,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 175,
                      "ray tracing": 100,
                      "ray tracing+DLSS quality": 113,
                      "ray tracing+DLSS balance": 115,
                      "ray tracing+DLSS performance": 119,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 145,
                      "ray tracing": 85,
                      "ray tracing+DLSS quality": 100,
                      "ray tracing+DLSS balance": 103,
                      "ray tracing+DLSS performance": 105,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 124,
                      "ray tracing+DLSS balance": 91,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 175,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 60,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 111,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                    fpsAttrs: {
                      DX: 83,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                    fpsAttrs: {
                      DX: 74,
                    },
                  },
                ],
                "2k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 145,
                      "ray tracing": 90,
                      "ray tracing+DLSS quality": 107,
                      "ray tracing+DLSS balance": 109,
                      "ray tracing+DLSS performance": 113,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 129,
                      "ray tracing": 78,
                      "ray tracing+DLSS quality": 96,
                      "ray tracing+DLSS balance": 101,
                      "ray tracing+DLSS performance": 106,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 105,
                      "ray tracing": 64,
                      "ray tracing+DLSS quality": 82,
                      "ray tracing+DLSS balance": 87,
                      "ray tracing+DLSS performance": 93,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 86,
                      "ray tracing+DLSS balance": 76,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 127,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 44,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 75,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                    fpsAttrs: {
                      DX: 60,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                    fpsAttrs: {
                      DX: 56,
                    },
                  },
                ],
                "4k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 85,
                      "ray tracing": 55,
                      "ray tracing+DLSS quality": 79,
                      "ray tracing+DLSS balance": 87,
                      "ray tracing+DLSS performance": 95,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 75,
                      "ray tracing": 47,
                      "ray tracing+DLSS quality": 70,
                      "ray tracing+DLSS balance": 77,
                      "ray tracing+DLSS performance": 84,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 55,
                      "ray tracing": 30,
                      "ray tracing+DLSS quality": 49,
                      "ray tracing+DLSS balance": 60,
                      "ray tracing+DLSS performance": 65,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 47,
                      "ray tracing+DLSS balance": 46,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 74,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 28,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 5700 XT 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25704/webp/400",
                    fpsAttrs: {
                      DX: 38,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5700 GAMING OC 8G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/23248/webp/400",
                    fpsAttrs: {
                      DX: 33,
                    },
                  },
                  {
                    videoCardName: "Radeon™ RX 5600 XT GAMING OC 6G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/25013/webp/400",
                    fpsAttrs: {
                      DX: 27,
                    },
                  },
                ],
              },
            },
            {
              videoGameName: "Assassin's Creed Valhalla",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/assassin's_creed_valhalla.f5537afd.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 97,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 92,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 82,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 81,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                    fpsAttrs: {
                      DX: 82,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 77,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 55,
                    },
                  },
                ],
                "2k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 83,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 78,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 69,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 64,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                    fpsAttrs: {
                      DX: 67,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 58,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 43,
                    },
                  },
                ],
                "4k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 58,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3080 MASTER 10G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/942bdd75757e716e80d788136b7a1897/Product/25953/webp/400",
                    fpsAttrs: {
                      DX: 54,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3070 MASTER 8G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/da64643ca9af2f1b8ded8e595448ffed/Product/26737/webp/400",
                    fpsAttrs: {
                      DX: 47,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 3060 ELITE 12G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/28094/webp/400",
                    fpsAttrs: {
                      DX: 41,
                    },
                  },
                  {
                    videoCardName: "AORUS GeForce RTX™ 2080 Ti 11G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/05799d4b567c7205309f64ae2bb143a5/Product/23135/webp/400",
                    fpsAttrs: {
                      DX: 44,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 XT MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26818/webp/400",
                    fpsAttrs: {
                      DX: 35,
                    },
                  },
                  {
                    videoCardName: "AORUS Radeon™ RX 6800 MASTER 16G",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26804/webp/400",
                    fpsAttrs: {
                      DX: 21,
                    },
                  },
                ],
              },
            },
            {
              videoGameName: "HITMAN 3",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/hitman3.b24f5e8e.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 222,
                    },
                  },
                ],
                "2k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 203,
                    },
                  },
                ],
                "4k": [
                  {
                    videoCardName: "AORUS GeForce RTX™ 3090 XTREME 24G ",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/bca9c8f7bd6517cefc26df54eb3ba2dc/Product/26279/webp/400",
                    fpsAttrs: {
                      DX: 123,
                    },
                  },
                ],
              },
            },
          ],
        }
      : {
          games: [
            {
              videoGameName: "CYBERPUNK 2077",
              videoGameImgUrl:
                "https://www.aorus.com/assets/img/Cyberpunk_2077.71d10fd3.jpg",
              relatedItems: {
                "1080": [
                  {
                    videoCardName:
                      "Gigabyte AERO KD-72RU624SD (AERO15OLED_KD-72RU624SD",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/30d005e1e961b2874eb409b97c2a68ab/Product/28118/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 123,
                      "ray tracing": 70,
                      "ray tracing+DLSS quality": 86,
                      "ray tracing+DLSS balance": 87,
                      "ray tracing+DLSS performance": 88,
                    },
                  },
                  {
                    videoCardName:
                      "AORUS 17.3 FHD 300Hz/Intel i7-11800H/16/512GB/NVD3060P-6/DOS",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/4d88cd80508c544adef1c58afaf3dcac/Product/28136/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 114,
                      "ray tracing": 67,
                      "ray tracing+DLSS quality": 84,
                      "ray tracing+DLSS balance": 85,
                      "ray tracing+DLSS performance": 86,
                    },
                  },
                  {
                    videoCardName:
                      "Gigabyte G5 KC 15.6 FHD 144Hz/intel i5-10500H/16/512GB/NVD3060P-6/DOS",
                    videoCardPictureUrl:
                      "https://static.gigabyte.com/StaticFile/Image/Global/30d005e1e961b2874eb409b97c2a68ab/Product/28118/webp/400",
                    fpsAttrs: {
                      "No ray tracing": 87,
                      "ray tracing": 50,
                      "ray tracing+DLSS quality": 77,
                      "ray tracing+DLSS balance": 82,
                      "ray tracing+DLSS performance": 86,
                    },
                  },
                ],
                "2k": [],
                "4k": [],
              },
            },
          ],
        }
  );
};
