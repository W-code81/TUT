import jwt from "jsonwebtoken"
export default defineEventHandler(async (event) =>{
    const {token} = await readBody(event)

    if (!token) {
        throw createError({statusCode: 400, message:"no token was passed" })
    }

    const user = jwt.verify(token, process.env.JWT_PRIVATE!)

    if (user){
      return { succces:true,
        user:{
            user
        }
      }
    }

  throw createError({statusCode: 401, message:"not authorized" })
});