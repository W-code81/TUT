import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

const fruitsTable = sqliteTable("fruits", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
})

const userTable = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    email: text().notNull(),
    nickname: text().notNull(),
    password: text().notNull(),
    resetPasswordToken: text(), // allow null when no reset token is set (text() is nullable by default)
    resetPasswordExpires: int(),// integer builder in this setup is nullable by default, so omit .nullable()
    createdAt: int(),
    updatedAt: int(),
})

export default fruitsTable;
export { userTable };