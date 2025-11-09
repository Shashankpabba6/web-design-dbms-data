CREATE TABLE `merchants` (
	`merchant_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`merchant_code` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`contact_phone` text,
	`description` text,
	`total_transactions` integer DEFAULT 0 NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`logo` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `merchants_merchant_code_unique` ON `merchants` (`merchant_code`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`transaction_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`txn_ref` text NOT NULL,
	`type` text NOT NULL,
	`from_user_id` text,
	`to_user_id` text,
	`to_merchant_id` integer,
	`recipient_name` text NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	`channel` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`from_user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_merchant_id`) REFERENCES `merchants`(`merchant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_txn_ref_unique` ON `transactions` (`txn_ref`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `wallets` (
	`wallet_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
