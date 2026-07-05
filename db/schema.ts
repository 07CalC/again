import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const thoughts = sqliteTable("thoughts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text("content"),
  createdAt: text("createdAt").$defaultFn(() => new Date().toISOString()),
})
