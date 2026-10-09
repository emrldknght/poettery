CREATE TABLE `poem_tags` (
	`slug` text NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`slug`, `tag_id`),
	FOREIGN KEY (`slug`) REFERENCES `poems`(`slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `poems` (
	`slug` text PRIMARY KEY NOT NULL,
	`file_path` text NOT NULL,
	`layout` text DEFAULT 'poem',
	`title` text,
	`date` text,
	`section` text DEFAULT 'main',
	`published` integer DEFAULT true,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);