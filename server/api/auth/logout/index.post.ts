import { clearAuthCookie } from "~~/server/utils/cookies";
import { success } from "~~/server/utils/response";

export default defineEventHandler(async (event) => {

    try {
        clearAuthCookie(event);

    return success(null, "Logged out")
    } catch (error) {
        throw error
    }
});