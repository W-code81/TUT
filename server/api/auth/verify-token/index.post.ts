import { verifyToken } from "~~/server/utils/jwt";
export default defineEventHandler(async (event) =>{
    const {token} = await readBody(event)

    if (!token) {
        throw createError({statusCode: 400, message:"no token was passed" })
    }

    const user = verifyToken(token)

    if (user){
      return { succces:true,
        user
      }
    }

  throw createError({statusCode: 401, message:"not authorized" })
});