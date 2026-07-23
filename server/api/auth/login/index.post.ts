import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import { eq } from "drizzle-orm"; //for filtering the data
import { signToken } from "~~/server/utils/jwt";
import { setAuthCookie } from "~~/server/utils/cookies";
import { validateLogin } from "~~/server/validation/auth";
import { comparePassword } from "~~/server/utils/password";
import { success } from "~~/server/utils/response";
import { publicUser } from "~~/server/utils/user";

export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);
        const { email, password } = validateLogin(body);

        const user = await db.select().from(userTable).where(eq(userTable.email, email));

        if (user.length === 0 || !user[0]) {
            throw createError({ statusCode: 404, message: "User not found" })
        }

        const foundUser = user[0];
        const isPasswordValid = await comparePassword(password, foundUser.password);

        if (!isPasswordValid) {
            throw createError({ statusCode: 404, message: "incorrect password" });
        }

        const token = signToken(foundUser.id)

        setAuthCookie(event, token);

        return success( publicUser(foundUser), "Log in successful")

    } catch (error) {
        throw error
    }


});