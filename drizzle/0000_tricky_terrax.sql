CREATE TABLE `site_content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
