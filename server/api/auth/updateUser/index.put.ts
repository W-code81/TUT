import db from "../../../db/index";
import { userTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "~~/server/utils/auth";
import { validateUpdate } from "~~/server/validation/auth";
import { hashPassword } from "~~/server/utils/password";
import { success } from "~~/server/utils/response";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const { nickname , email , password } = validateUpdate(body);

    const currentUser = await requireUser(event);

    const updateData: Record<string, any> = {}; // prepare object to hold fields to update
    if (nickname !== undefined) updateData.nickname = nickname; // add nickname if provided
    if (email !== undefined) updateData.email = email; // add email if provided
    if (password !== undefined) {
        const hashed = await hashPassword(password); // hash password before saving
        updateData.password = hashed; // store hashed password
    }
    // use Date object for timestamps
    updateData.updatedAt = new Date(); // update timestamp for record

    if (Object.keys(updateData).length > 0) {
        await db
            .update(userTable)
            .set(updateData) // apply only provided changes
            .where(eq(userTable.id, currentUser!.id)); // target current user's record
    }

    return  success(null , "Profile updated")
   
});