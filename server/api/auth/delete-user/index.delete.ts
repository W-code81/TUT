import db from "../../../db/index";
import { userTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "~~/server/utils/auth";
import { clearAuthCookie } from "~~/server/utils/cookies";
import { success } from "~~/server/utils/response";


export default defineEventHandler(async (event) => {

    try {
        const currentUser = await requireUser(event);

        await db
            .delete(userTable)
            .where(eq(userTable.id, currentUser!.id));

        clearAuthCookie(event);

        return success(null, "Account deleted")
    } catch (error) {
        throw error
    }
});