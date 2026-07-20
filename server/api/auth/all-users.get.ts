import db from "../../db/index";
import {userTable} from "../../db/schema";

export default defineEventHandler(async () => {
  try {
    return await db.select().from(userTable);
  } catch (error) {
    throw createError({statusCode:500 , message: "failed to fetch all users"})
  }
  
});