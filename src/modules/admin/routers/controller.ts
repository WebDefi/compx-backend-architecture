import { FastifyRequest, FastifyReply } from "fastify";
import { RouteGenericInterfacePostXml } from "./reqInterface";
import Brandshop from "../../utils/Brandshop-service/Brandshop";
import adminService from "../utils/adminService";

export const uploadXmlData = async (
  req: FastifyRequest<RouteGenericInterfacePostXml>,
  rep: FastifyReply
) => {
  const xmlFile = Buffer.from(req.body.xmlData, "base64");
  const xmlData = await Brandshop.parseXml(xmlFile, {
    category: { id: true, name: true },
    item: {
      categoryId: true,
      name: true,
      description: true,
      url: true,
      images: true,
      priceRUAH: true,
      detailedDescriptionRU: true,
      detailedDescriptionUA: true,
      stock: true,
      characteristics: true,
    },
  });
  // xmlData.items.forEach((item: any) => console.log(item.characteristics.charItem));
  const insertData = await adminService.createRecord(xmlData);
  if (insertData.error) {
    return rep.status(400).send(insertData);
  }
  return rep.status(201).send(insertData);
};
