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
    charValues != undefined ? JSON.parse(decodeURI(charValues)) : undefined
  );
  if (itemsResponse.error) {
    return rep.status(400).send(itemsResponse);
  }
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
  const itemsResult = {
    items: itemsResponse.rows,
    characteristics: itemCharacteristics.rows[0].characteristics,
    bannerImageUrl: `https://compx-filestore.s3.eu-west-1.amazonaws.com/${
      groupBanner.rows[0].banner_image_url ?? ""
    }`,
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
  const fpsItems: any = await gigabyteService.getFpsItems();
  if (fpsItems.error) {
    return rep.status(400).send(fpsItems);
  }
  return rep.status(200).send({ games: fpsItems.rows });
};
