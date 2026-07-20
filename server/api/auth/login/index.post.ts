import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"; //for filtering the data
import { signToken } from "~~/server/utils/jwt";

export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);
        const { name, password } = body as { name: string; password: string };

        if (!(name && password)) {
            throw createError({ statusCode: 400, message: "name or password not provided" });
        }

        const user = await db.select().from(userTable).where(eq(userTable.name, name));

        if (user.length === 0 || !user[0]) {
            throw createError({ statusCode: 404, message: "User not found" })
        }

        const foundUser = user[0];
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            throw createError({ statusCode: 404, message: "incorrect password" });
        }

        const token = signToken(foundUser.id)

        return {
            token
        }
    } catch (error) {
        throw createError({ statusCode: 500, message: `${error}` });
    }


});