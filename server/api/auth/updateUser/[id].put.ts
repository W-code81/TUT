import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import { eq } from "drizzle-orm"; //for filtering the data

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, password } = body as { name: string; password: string };
    const { id } = event.context.params as { id: string };

    const updatedUser = await db.update(userTable).set({
      name: name,
      password: password
    }).where(eq(userTable.id, parseInt(id))).returning(); //parseInt is used to convert the id from string to number since the id in the database is of type number

    return updatedUser;
  } catch (error) {
    throw createError({statusCode:500 , message: " failed to update user info"})
  }

});