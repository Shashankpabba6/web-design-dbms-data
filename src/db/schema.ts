import { pgTable, varchar, integer, numeric, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

// Users table with varchar primary key
export const users = pgTable('users', {
  userId: varchar('user_id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').notNull(),
});

// Wallets table
export const wallets = pgTable('wallets', {
  walletId: serial('wallet_id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.userId),
  balance: numeric('balance', { precision: 10, scale: 2 }).notNull().default('0'),
  currency: varchar('currency', { length: 10 }).notNull().default('INR'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// Merchants table
export const merchants = pgTable('merchants', {
  merchantId: serial('merchant_id').primaryKey(),
  merchantCode: varchar('merchant_code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  description: varchar('description', { length: 1000 }),
  totalTransactions: integer('total_transactions').notNull().default(0),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  featured: boolean('featured').notNull().default(false),
  logo: varchar('logo', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').notNull(),
});

// Transactions table
export const transactions = pgTable('transactions', {
  transactionId: serial('transaction_id').primaryKey(),
  txnRef: varchar('txn_ref', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(),
  fromUserId: varchar('from_user_id', { length: 255 }).references(() => users.userId),
  toUserId: varchar('to_user_id', { length: 255 }).references(() => users.userId),
  toMerchantId: integer('to_merchant_id').references(() => merchants.merchantId),
  recipientName: varchar('recipient_name', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  channel: varchar('channel', { length: 50 }).notNull(),
  description: varchar('description', { length: 1000 }),
  createdAt: timestamp('created_at').notNull(),
});

// Auth tables for better-auth
export const user = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: varchar("image", { length: 500 }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: varchar("user_agent", { length: 500 }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: varchar("access_token", { length: 1000 }),
  refreshToken: varchar("refresh_token", { length: 1000 }),
  idToken: varchar("id_token", { length: 1000 }),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 500 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 1000 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => new Date(),
  ),
});