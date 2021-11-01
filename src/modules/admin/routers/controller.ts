import { FastifyRequest, FastifyReply } from "fastify";
import { RouteGenericInterfacePostXml } from "./reqInterface";
import Brandshop from "../../utils/Brandshop-service/Brandshop";
import adminService from "../utils/adminService";

export const uploadXmlData = async (
  req: FastifyRequest<RouteGenericInterfacePostXml>,
  rep: FastifyReply
) => {
  console.log(req.body);
  try {
    // const xmlFile = Buffer.from(req.body.xmlData, "base64");
    // const xmlData = await Brandshop.parseXml(xmlFile, {
    //   category: { id: true, name: true },
    //   item: {
    //     categoryId: true,
    //     name: true,
    //     description: true,
    //     url: true,
    //     images: true,
    //     priceRUAH: true,
    //     detailedDescriptionRU: true,
    //     detailedDescriptionUA: true,
    //     stock: true,
    //     characteristics: true,
    //     condition: true,
    //   },
    // });
    // xmlData.items.forEach((item: any) => console.log(item.characteristics.charItem));
    const insertData = await adminService.createRecord(req.body);
    if (insertData.error) {
      return rep.status(400).send(insertData);
    }
    return rep.status(201).send(insertData);
  } catch (error) {
    return rep.status(400).send({ error });
  }
};
