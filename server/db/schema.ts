import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

const fruitsTable = sqliteTable("fruits", {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
})

const userTable = sqliteTable("users", {
    id: int().primaryKey({autoIncrement: true}),
    name: text().notNull(),
    password: text().notNull(),
    resetPasswordToken: text()
})

export default fruitsTable;
export { userTable };