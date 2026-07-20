// server/api/fruits.get.ts
import db from "../../db/index";
import fruitsTable from "../../db/schema";

export default defineEventHandler(async () => {
  return await db.select().from(fruitsTable);
});