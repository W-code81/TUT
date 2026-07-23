import { success } from "~~/server/utils/response";
import db from "../../db/index";
import { userTable } from "../../db/schema";
import { publicUser } from "~~/server/utils/user";

export default defineEventHandler(async (event) => {

  await requireUser(event);

  const users = await db.select().from(userTable);

  return success(
    users.map(publicUser)
  );

});