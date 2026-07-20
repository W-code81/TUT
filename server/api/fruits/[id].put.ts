import db from "../../db/index";
import fruitsTable from "../../db/schema";
import { eq } from "drizzle-orm"; //for filtering the data

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = event.context.params as { id: string };

  const updatedFruit =  await db.update(fruitsTable).set({
    name: body.name,
  }).where(eq(fruitsTable.id, parseInt(id))).returning(); //parseInt is used to convert the id from string to number since the id in the database is of type number

  return updatedFruit;
});