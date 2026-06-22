import { pgTable, serial, text, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const boxesTable = pgTable("subscription_boxes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  frequency: text("frequency").notNull().default("weekly"),
  imageUrl: text("image_url"),
  items: text("items").array().notNull().default([]),
  highlight: text("highlight"),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const insertBoxSchema = createInsertSchema(boxesTable).omit({ id: true });
export type InsertBox = z.infer<typeof insertBoxSchema>;
export type Box = typeof boxesTable.$inferSelect;
