// server/api/fruits.post.ts
import db from "../../db/index";
import fruitsTable from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = await db.insert(fruitsTable).values({
    name: body.name,
  }).returning();

  return {
    success: true,
    result,
  };
});