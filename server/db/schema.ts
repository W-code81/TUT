import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    email: text().notNull().unique(),
    nickname: text().notNull(),
    password: text().notNull(),
    resetPasswordToken: text(), // allow null when no reset token is set (text() is nullable by default)
    resetPasswordExpires: int(),// integer builder in this setup is nullable by default, so omit .nullable()
    createdAt: int().notNull(),
    updatedAt: int().notNull(),
})