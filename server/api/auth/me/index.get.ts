import { requireUser } from "~~/server/utils/auth";
import { success } from "~~/server/utils/response";
import { publicUser } from "~~/server/utils/user";

export default defineEventHandler(async (event) => {
    try {
        const user = await requireUser(event);

        if (!user) {
            throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
        }

        return success(publicUser(user));
    } catch (error) {
        throw error
    }
});