import { userTable } from "~~/server/db/schema";
import db from "../../../../db/index";
import { eq, and, gt } from "drizzle-orm";
import { hashToken } from "~~/server/validation/auth";
import { success } from "~~/server/utils/response";

export default defineEventHandler(async (event) => {
    try {
        const token = getRouterParam(event, "token");

        if (!token) {
            throw createError({ statusCode: 400, message: "Token not provided" });
        }

        //hash the token from the URL to compare with DB
        const hashedToken = hashToken(token)

        //looks up the user with the hashed token and checks if it's not expired (greater than now)
        const users = await db
            .select()
            .from(userTable)
            .where(
                and(
                    eq(userTable.resetPasswordToken, hashedToken),
                    gt(userTable.resetPasswordExpires, Date.now())
                )
            );

        if (!users || users.length === 0) {
            throw createError({ statusCode: 400, message: "Invalid or expired token" });
        }

        const user = users[0];

        return success({userId: user!.id})
        //  {
        //     success: true,
        //     message: "reset page render",
        //     userId: user!.id
        // };

    } catch (error) {
        throw error
    }
});

