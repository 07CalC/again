CREATE TABLE `shelf_items` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'want' NOT NULL,
	`creator` text,
	`description` text,
	`thoughts` text,
	`rating` integer,
	`imageUrl` text,
	`aspect` text DEFAULT 'portrait',
	`externalUrl` text,
	`tags` text DEFAULT '[]',
	`meta` text,
	`addedAt` text NOT NULL,
	`completedAt` text,
	`published` integer DEFAULT false NOT NULL,
	`createdAt` text,
	`updatedAt` text
);
--> statement-breakpoint
CREATE INDEX `shelf_items_slug_idx` ON `shelf_items` (`slug`);--> statement-breakpoint
CREATE INDEX `shelf_items_category_idx` ON `shelf_items` (`category`);--> statement-breakpoint
CREATE INDEX `shelf_items_published_idx` ON `shelf_items` (`published`);