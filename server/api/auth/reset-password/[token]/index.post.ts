import { userTable } from "~~/server/db/schema";
import db from "../../../../db/index";
import { eq } from "drizzle-orm";
import { clearAuthCookie } from "~~/server/utils/cookies";
import { hashPassword } from "~~/server/utils/password";
import { hashToken, validatePassword } from "~~/server/validation/auth";
import { success } from "~~/server/utils/response";



export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);
        const { password } = validatePassword(body)
        const token = getRouterParam(event, 'token');

        if (!token) {
            throw createError({ statusCode: 400, message: "token is required" });
        }

        // hash the token from the URL to compare with DB
        const hashedToken = hashToken(token);

        // looks up the user with the hashed token and checks if it's not expired (greater than now)
        const users = await db.select().from(userTable).where(eq(userTable.resetPasswordToken, hashedToken));

        if (users.length === 0 || !users[0]) {
            throw createError({ statusCode: 400, message: "Invalid or expired token" });
        }

        const user = users[0];

        if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
            throw createError({ statusCode: 400, message: "Invalid or expired token" });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // update user with new password and remove token (one-time use)
        await db.update(userTable).set({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        }).where(eq(userTable.id, user.id));

        clearAuthCookie(event); //This ensures that if someone was logged in on another device (or had a stale cookie), they'll need to authenticate again after the password change.

        return success(null, "Password reset successful." )
       

    } catch (error) {
        throw error
    }

});