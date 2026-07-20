import db from "../../../db/index";
import { userTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "~~/server/utils/jwt";

export default defineEventHandler( async (event) => {

    // reading the authorization bearer
    const auth = getHeader(event, "authorization")

    // extract the token
    const token = auth?.split(" ")[1]

    if (!token) {
        throw new Error("Missing token")
    }

    //verifying payload
    const payload = verifyToken(token)

    if(!payload){
        throw new Error("No payload found")
    }

    // find the user with the payload
    const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, payload.id))

    if (!user || user.length === 0) {
        throw new Error("User not found")
    }

    return {
        user: {
            id: user[0]!.id,
            name: user[0]!.name
        }
    }
});