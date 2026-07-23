import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import { eq } from "drizzle-orm";
import { setAuthCookie } from "~~/server/utils/cookies";
import { validateSignup } from "~~/server/validation/auth";
import { hashPassword } from "~~/server/utils/password";
import { success } from "~~/server/utils/response";
import { publicUser } from "~~/server/utils/user";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, password, nickname } = validateSignup(body)

        const existingUser = await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email));

        if (existingUser.length > 0) {
            throw createError({
                statusCode: 409,
                message: "User already exists"
            });
        }

        const now = Date.now()
        const hashedPassword = await hashPassword(password)

        await db.insert(userTable).values({
            email,
            nickname,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now
        })

        const user = await db.select().from(userTable).where(eq(userTable.email, email));

        if (!user || user.length === 0){
            throw createError({ statusCode: 404, message: "no user found" })
        }

        const token = signToken(user[0]!.id);

        setAuthCookie(event, token);

        return success(publicUser(user[0]!))
   
    } catch (error) {
        throw error;
    }
})