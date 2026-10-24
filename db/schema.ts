import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const content = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  payload: text("payload").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});
