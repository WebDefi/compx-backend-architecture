import { FastifyRequest, FastifyReply } from "fastify";
import gigabyteService from "../utils/gigabyteService";
import { RouteGenericInterfaceItemsByCategory } from "./reqInterface";

export const getCategories = async (req: FastifyRequest, rep: FastifyReply) => {
  const categories = await gigabyteService.getAllCategories();
  if (categories.error) {
    return rep.status(400).send(categories);
  }
  return rep.status(200).send({ categories: categories.rows });
};

export const getItemsByCategory = async (
  req: FastifyRequest<RouteGenericInterfaceItemsByCategory>,
  rep: FastifyReply
) => {
  const queryString = req.query;
  const categoryId = req.params.categoryId;
  if (!categoryId)
    return rep.status(400).send({ error: "Category id wasn't presented" });
  const itemsResponse = await gigabyteService.getAllItemsByCategoryId(
    categoryId,
    queryString?.start,
    queryString?.end
  );
  if (itemsResponse.error) {
    return rep.status(400).send(itemsResponse);
  }
  return rep.status(200).send(itemsResponse.rows);
};
