CREATE TABLE `content_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ar` text NOT NULL,
	`summary_en` text NOT NULL,
	`summary_ar` text NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_content_kind_status_date` ON `content_items` (`kind`,`status`,`date`);