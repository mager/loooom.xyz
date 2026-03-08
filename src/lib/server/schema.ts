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
	meMd: text('me_md'), // Portable Human Context — me.md content (raw markdown)
	createdAt: timestamp('created_at').notNull().defaultNow(),
	firebaseUid: text('firebase_uid').unique(),
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

export const plugins = pgTable('plugins', {
	id: uuid('id').primaryKey().defaultRandom(),
	authorId: uuid('author_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	category: text('category'),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const pluginSkills = pgTable('plugin_skills', {
	id: uuid('id').primaryKey().defaultRandom(),
	pluginId: uuid('plugin_id')
		.notNull()
		.references(() => plugins.id),
	skillId: uuid('skill_id')
		.notNull()
		.references(() => skills.id),
	position: integer('position').notNull().default(0),
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

export const meMdVersions = pgTable('me_md_versions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id),
	content: text('content').notNull(),
	versionNum: integer('version_num').notNull().default(1),
	label: text('label'),
	charCount: integer('char_count').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
