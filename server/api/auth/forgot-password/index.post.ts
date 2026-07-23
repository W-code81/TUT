import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hashToken } from "~~/server/validation/auth";
import { success } from "~~/server/utils/response";


export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email } = body as { email: string };

        if (!email) {
            throw createError({ statusCode: 400, message: "email is required" });
        }

        const user = await db.select().from(userTable).where(eq(userTable.email, email));

        if (user.length === 0 || !user[0]) {
            throw createError({ statusCode: 404, message: "no user was found" });
        }

        const rawToken = randomBytes(32).toString('base64url');

        const hashedToken = hashToken(rawToken)

        // Update user with reset token and expiry
        await db.update(userTable)
            .set({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: Date.now() + 1000 * 60 * 15
            })
            .where(eq(userTable.id, user[0].id));

        const resetLink = `${process.env.LOCAL_URL}/api/auth/reset-password/${rawToken}`;
        console.log(resetLink) // for testing

        // use a transporter for resetLink

        return success(null, "If an account exists, a reset email has been sent.")
       

    } catch (error) {
        throw error
    }
});

