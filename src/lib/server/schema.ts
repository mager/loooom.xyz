import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	username: text('username').notNull().unique(),
	displayName: text('display_name').notNull(),
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	email: text('email'),
	xId: text('x_id').unique(),
	xUsername: text('x_username'),
	verified: boolean('verified').notNull().default(false),
	topics: jsonb('topics').$type<string[]>().default([]),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const skills = pgTable('skills', {
	id: uuid('id').primaryKey().defaultRandom(),
	authorId: uuid('author_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	category: text('category'),
	currentVersion: text('current_version'),
	installs: integer('installs').notNull().default(0),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const skillVersions = pgTable('skill_versions', {
	id: uuid('id').primaryKey().defaultRandom(),
	skillId: uuid('skill_id')
		.notNull()
		.references(() => skills.id),
	version: text('version').notNull(),
	contentHash: text('content_hash').notNull(),
	files: jsonb('files').$type<{ name: string; content: string }[]>().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const follows = pgTable('follows', {
	id: uuid('id').primaryKey().defaultRandom(),
	followerId: uuid('follower_id')
		.notNull()
		.references(() => users.id),
	followingId: uuid('following_id')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const waitlist = pgTable('waitlist', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
