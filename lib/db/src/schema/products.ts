import { pgTable, serial, text, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  categorySlug: text("category_slug").notNull(),
  categoryName: text("category_name").notNull(),
  farmId: integer("farm_id").notNull(),
  farmName: text("farm_name").notNull(),
  farmLocation: text("farm_location"),
  isOrganic: boolean("is_organic").notNull().default(false),
  isSeasonal: boolean("is_seasonal").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(100),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  badges: text("badges").array().notNull().default([]),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
