import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table with text primary key
export const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  createdAt: text('created_at').notNull(),
});

// Wallets table
export const wallets = sqliteTable('wallets', {
  walletId: integer('wallet_id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.userId),
  balance: real('balance').notNull().default(0),
  currency: text('currency').notNull().default('INR'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Merchants table
export const merchants = sqliteTable('merchants', {
  merchantId: integer('merchant_id').primaryKey({ autoIncrement: true }),
  merchantCode: text('merchant_code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  contactPhone: text('contact_phone'),
  description: text('description'),
  totalTransactions: integer('total_transactions').notNull().default(0),
  rating: real('rating').notNull().default(0),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  logo: text('logo').notNull(),
  createdAt: text('created_at').notNull(),
});

// Transactions table
export const transactions = sqliteTable('transactions', {
  transactionId: integer('transaction_id').primaryKey({ autoIncrement: true }),
  txnRef: text('txn_ref').notNull().unique(),
  type: text('type').notNull(),
  fromUserId: text('from_user_id').references(() => users.userId),
  toUserId: text('to_user_id').references(() => users.userId),
  toMerchantId: integer('to_merchant_id').references(() => merchants.merchantId),
  recipientName: text('recipient_name').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(),
  channel: text('channel').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});