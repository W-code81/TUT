import { createError } from "h3";

export function required(value: string, field: string) {
    if (!value.trim()) {
        throw createError({
            statusCode: 400,
            message: `${field} is required.`,
        });
    }
}

export function minLength(
    value: string,
    length: number,
    field: string
) {
    if (value.length < length) {
        throw createError({
            statusCode: 400,
            message: `${field} must be at least ${length} characters.`,
        });
    }
}

export function validEmail(email: string) {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        throw createError({
            statusCode: 400,
            message: "Invalid email address.",
        });
    }
}