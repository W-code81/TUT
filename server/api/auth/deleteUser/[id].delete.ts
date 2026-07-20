import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import { eq } from "drizzle-orm"; //for filtering the data


export default defineEventHandler(async (event) => {
    try {
        
        const { id } = event.context.params as { id: string };

        const deletedUser = await db.delete(userTable).where(eq(userTable.id, parseInt(id))).returning(); //parseInt is used to convert the id from string to number since the id in the database is of type number

        return {
            success: true,
            message: "User deleted successfully"
        }

    } catch (error) {
        throw createError({statusCode:500 ,  message: "failed to delete user"})
    }

});