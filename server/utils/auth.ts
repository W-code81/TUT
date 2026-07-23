import db from "../db/index";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { getCookie, createError, type H3Event } from "h3";
import { verifyToken } from "./jwt";
import { COOKIE_NAME } from "./cookies";

export async function requireUser(event: H3Event) {
    // Read JWT from cookie
    const token = getCookie(event, COOKIE_NAME);

    if (!token) {
        throw createError({
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    // Verify token
    const payload = verifyToken(token);

    // Find user
    const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, payload.id));

    if (users.length === 0) {
        throw createError({
            statusCode: 401,
            message: "User not found",
        });
    }

    return users[0];
}