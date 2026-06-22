import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const farmsTable = pgTable("farms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  state: text("state"),
  description: text("description"),
  story: text("story"),
  imageUrl: text("image_url"),
  coverImageUrl: text("cover_image_url"),
  established: integer("established").notNull(),
  certifications: text("certifications").array().notNull().default([]),
  productCount: integer("product_count").default(0),
  farmerName: text("farmer_name"),
  farmerImageUrl: text("farmer_image_url"),
});

export const insertFarmSchema = createInsertSchema(farmsTable).omit({ id: true });
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type Farm = typeof farmsTable.$inferSelect;
