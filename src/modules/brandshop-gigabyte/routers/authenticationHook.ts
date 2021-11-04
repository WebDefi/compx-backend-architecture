import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export const Authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: any
) => {
  console.log(request.headers);
  const tokenToVerify: any = request.headers.authorization;
  try {
    const payload: any = verify(
      tokenToVerify.split(" ")[1],
      "clownDoesBeepBeep"
    );
    done();
    return;
  } catch (errAccess) {
    return reply.status(401).send({ errAccess });
  }
};
