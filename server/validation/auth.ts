import { createError } from "h3";
import { createHmac } from "crypto";

export interface LoginBody {
    email: string;
    password: string;
}

export interface SignupBody {
    email: string;
    nickname: string;
    password: string;
}

export interface ValidateBody {
    email?: string;
    nickname?: string;
    password?: string;
}

export interface ValidatePassword {
    password: string;
}

export function validateLogin(body: unknown): LoginBody {

    const { email, password } = body as LoginBody;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: "Email and password are required."
        });
    }

    return {
        email: email.trim().toLowerCase(),
        password
    };
}

export function validateSignup(body: unknown): SignupBody {

    const { email, nickname, password } = body as SignupBody;

    if (!email || !nickname || !password) {
        throw createError({
            statusCode: 400,
            message: "All fields are required."
        });
    }

    if (nickname.length < 3) {
        throw createError({
            statusCode: 400,
            message: "Nickname must be at least 3 characters."
        });
    }

    if (password.length < 8) {
        throw createError({
            statusCode: 400,
            message: "Password must be at least 8 characters."
        });
    }

    return {
        email: email.trim().toLowerCase(),
        nickname: nickname.trim(),
        password
    };
}

export function validateUpdate(body: unknown): ValidateBody {
    const { email, nickname, password } = body as ValidateBody;

    if (nickname !== undefined && nickname.length < 3) {
        throw createError({
            statusCode: 400,
            message: "Nickname must be at least 3 characters."
        });
    }

    if (password !== undefined && password.length < 8) {
        throw createError({
            statusCode: 400,
            message: "Password must be at least 8 characters."
        });
    }

    return {
        ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
        ...(nickname !== undefined ? { nickname: nickname.trim() } : {}),
        ...(password !== undefined ? { password } : {})
    };
}

export function validatePassword(body: unknown): ValidatePassword {
    const { password } = body as ValidatePassword

    if (!password) {
        throw createError({ statusCode: 400, message: "password is required" });
    }

    if (password.length < 8) {
        throw createError({ statusCode: 400, message: "password must be greater than 8" });
    }

    return {
        password
    }
}

export const hashToken = (token: string) => createHmac("sha256", process.env.CRYPTO_KEY || "").update(token).digest("hex");