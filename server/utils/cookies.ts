import { setCookie, deleteCookie, type H3Event } from "h3";

const COOKIE_NAME = "jwt_token";

export function setAuthCookie(event: H3Event, token: string) {
    setCookie(event, COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });
}

export function clearAuthCookie(event: H3Event) {
    deleteCookie(event, COOKIE_NAME, {
        path: "/",
    });
}

export { COOKIE_NAME };