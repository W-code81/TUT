import { userTable } from "../db/schema";

type DbUser = typeof userTable.$inferSelect;

export function publicUser(user: DbUser) {
    return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
    };
}