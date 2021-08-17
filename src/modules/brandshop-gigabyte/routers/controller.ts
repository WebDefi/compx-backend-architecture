import { FastifyRequest, FastifyReply } from "fastify";
import gigabyteService from "../utils/gigabyteService";
import { RouteGenericInterfaceItemsByCategory } from "./reqInterface";

export const getGroups = async (req: FastifyRequest, rep: FastifyReply) => {
  const groups = await gigabyteService.getAllGroups();
  if (groups.error) {
    return rep.status(400).send(groups);
  }
  return rep.status(200).send({ groups: groups.rows });
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
    characteristics: [
      ...Object.keys(itemCharacteristicsObject).map((name: string) => {
        let tempObj = itemCharacteristicsObject[name];
        return {
          name: name,
          alias: tempObj.alias,
          values: tempObj.values,
        };
      }),
    ],
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
  return rep.status(200).send({ gallery: galleryItems.rows });
};

export const getNews = async (req: FastifyRequest, rep: FastifyReply) => {
  const newsItems: any = await gigabyteService.getAllActiveNews();
  if (newsItems.error) {
    return rep.status(400).send(newsItems);
  }
  return rep.status(200).send({ news: newsItems.rows });
};

export const getSales = async (req: FastifyRequest, rep: FastifyReply) => {
  const salesItems: any = await gigabyteService.getAllActiveNews();
  if (salesItems.error) {
    return rep.status(400).send(salesItems);
  }
  return rep.status(200).send({ news: salesItems.rows });
};

export const getSlider = async (req: FastifyRequest, rep: FastifyReply) => {
  const sliderItems: any = await gigabyteService.getAllActiveSliderItems();
  if (sliderItems.error) {
    return rep.status(400).send(sliderItems);
  }
  return rep.status(200).send({ slider: sliderItems.rows });
};
