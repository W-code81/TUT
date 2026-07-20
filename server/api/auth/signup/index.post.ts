import { userTable } from "~~/server/db/schema";
import db from "../../../db/index";
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { name, password } = body as { name: string; password: string };

        const existingUser = await db
            .select()
            .from(userTable)
            .where(eq(userTable.name, name));

        if (existingUser.length > 0) {
            throw createError({
                statusCode: 409,
                message: "User already exists"
            });
        }

        await db.insert(userTable).values({
            name,
            password: await bcrypt.hash(password, 10),
        });

        const user = await db.select().from(userTable).where(eq(userTable.name, name));

        return {
            user: {
                id: user[0]!.id,
                name: user[0]!.name,
            }
        }
    } catch (error) {
        throw error;
    }
})