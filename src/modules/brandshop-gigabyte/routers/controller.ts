import { FastifyRequest, FastifyReply } from "fastify";
import gigabyteService from "../utils/gigabyteService";
import { RouteGenericInterfaceItemsByCategory } from "./reqInterface";

export const getGroups = async (req: FastifyRequest, rep: FastifyReply) => {
  const groups = await gigabyteService.getAllGroups();
  if (groups.error) {
    return rep.status(400).send(groups);
  }
  const resultGroups = groups.rows.map((group: any) => {
    let tempImage = group.image_url;
    delete group["image_url"];
    delete group["banner_image_url"];
    group["imageUrl"] = `https://compx-filestore.s3.eu-west-1.amazonaws.com/${
      tempImage ?? ""
    }`;
    return group;
  });
  return rep.status(200).send({ groups: resultGroups });
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

export const getNews = async (req: FastifyRequest, rep: FastifyReply) => {
  const newsItems: any = await gigabyteService.getAllActiveNews();
  if (newsItems.error) {
    return rep.status(400).send(newsItems);
  }
  return rep.status(200).send({ news: newsItems.rows });
};

export const getSales = async (req: FastifyRequest, rep: FastifyReply) => {
  const salesItems: any = await gigabyteService.getAllActiveSales();
  if (salesItems.error) {
    return rep.status(400).send(salesItems);
  }
  return rep.status(200).send({ sales: salesItems.rows });
};

export const getSlider = async (req: FastifyRequest, rep: FastifyReply) => {
  const sliderItems: any = await gigabyteService.getAllActiveSliderItems();
  if (sliderItems.error) {
    return rep.status(400).send(sliderItems);
  }
  return rep.status(200).send({ slider: sliderItems.rows });
};

export const getFpsGamesChars = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  // const fpsItems: any = await gigabyteService.getFpsItems();
  // if (fpsItems.error) {
  //   return rep.status(400).send(fpsItems);
  // }
  return rep.status(200).send({
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
  });
};
