import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const poems = sqliteTable('poems', {
  slug: text('slug').primaryKey(),
  file_path: text('file_path').notNull(),
  layout: text('layout').default('poem'),
  title: text('title'),
  date: text('date'),
  section: text('section').default('main'),
  published: integer('published', { mode: 'boolean' }).default(true),
  updated_at: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

export const poemsRelations = relations(poems, ({ many }) => ({
  tags: many(poemTags),
}));

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  poems: many(poemTags),
}));

export const poemTags = sqliteTable('poem_tags', {
  slug: text('slug').notNull().references(() => poems.slug),
  tagId: integer('tag_id').notNull().references(() => tags.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.slug, table.tagId] }),
}));

export const poemTagsRelations = relations(poemTags, ({ one }) => ({
  poem: one(poems, {
    fields: [poemTags.slug],
    references: [poems.slug],
  }),
  tag: one(tags, {
    fields: [poemTags.tagId],
    references: [tags.id],
  }),
}));