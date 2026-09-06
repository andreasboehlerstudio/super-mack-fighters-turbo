CREATE TABLE `highscores` (
	`id` text PRIMARY KEY NOT NULL,
	`initials` text NOT NULL,
	`hero` text NOT NULL,
	`score` integer NOT NULL,
	`tour` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `highscores_ranking` ON `highscores` (`tour`,`score`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`offer` text NOT NULL,
	`answer` text,
	`config` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rooms_expiry` ON `rooms` (`expires`);