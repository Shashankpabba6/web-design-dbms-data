# PhonePe Clone - Digital Payments App

A full-stack digital payments application inspired by PhonePe, built with Next.js, TypeScript, and modern web technologies. This project demonstrates a complete payment ecosystem with user authentication, wallet management, transactions, and merchant integration.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/register with Better Auth
- **Digital Wallet** - Add money, withdraw, and manage balances
- **Transaction History** - View and filter all payment activities
- **Merchant Directory** - Browse and search for payment partners
- **Real-time Balance Updates** - Live wallet balance tracking

### Technical Features
- **Full-stack TypeScript** - Type-safe development
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Database Integration** - SQLite with Drizzle ORM
- **API Routes** - RESTful endpoints for all operations
- **Modern UI Components** - Built with shadcn/ui and Radix UI

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable UI components
- **Radix UI** - Primitives for accessible components
- **Framer Motion** - Animations and transitions

### Backend
- **Next.js API Routes** - Serverless functions
- **Better Auth** - Authentication library
- **Drizzle ORM** - TypeScript ORM for database operations
- **SQLite** - Database with Turso driver
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundling and development

## 📁 Project Structure

```
shashankpabba6-web-design-dbms-data/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── merchants/     # Merchant management
│   │   │   ├── transactions/  # Transaction operations
│   │   │   ├── users/         # User management
│   │   │   └── wallets/       # Wallet operations
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── merchants/         # Merchant directory
│   │   └── transactions/      # Transaction history
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── AddMoneyDialog.tsx
│   │   ├── WithdrawDialog.tsx
│   │   ├── Navigation.tsx
│   │   └── ErrorReporter.tsx
│   ├── db/                   # Database configuration
│   │   ├── schema.ts         # Database schemas
│   │   ├── index.ts          # Database connection
│   │   └── seeds/            # Sample data
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # Auth configuration
│   │   ├── auth-client.ts   # Client-side auth
│   │   └── utils.ts         # Helper functions
│   └── hooks/               # Custom React hooks
├── drizzle/                 # Database migrations
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shashankpabba6-web-design-dbms-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   TURSO_CONNECTION_URL=your_turso_connection_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run db:push
   
   # Seed with sample data (if available)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Core Tables
- **users** - User profiles and authentication
- **wallets** - Digital wallet balances and transactions
- **transactions** - Payment and transfer records
- **merchants** - Business partners and payment destinations
- **auth_tables** - Better Auth system tables (user, session, account, verification)

### Key Relationships
- Users have one wallet
- Transactions link users and merchants
- Wallets track balance changes through transactions
- Merchants have transaction statistics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/[...all]` - Handle auth requests

### Users
- `GET /api/users/[id]` - Get user profile

### Wallets
- `GET /api/wallets/user/[userId]` - Get wallet balance
- `POST /api/wallets/add-money` - Add funds to wallet
- `POST /api/wallets/withdraw` - Withdraw from wallet

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/user/[userId]` - Get user transactions

### Merchants
- `GET /api/merchants` - List merchants (with search/filters)
- `GET /api/merchants/[id]` - Get merchant details

## 🎨 UI Components

The project uses a comprehensive set of UI components from shadcn/ui including:
- **Layout**: Card, Sheet, Dialog, Drawer
- **Forms**: Input, Button, Select, Checkbox, Label
- **Navigation**: Tabs, Breadcrumb, Pagination
- **Data Display**: Table, Badge, Avatar, Progress
- **Feedback**: Alert, Toast, Skeleton, Spinner

## 🔒 Authentication Flow

1. **Registration** - Users create accounts with email and password
2. **Login** - Secure session-based authentication
3. **Protected Routes** - Middleware protects dashboard and transaction pages
4. **Session Management** - Automatic token handling and refresh

## 💳 Payment Flow

1. **Wallet Top-up** - Users add money via bank transfer simulation
2. **Payments** - Send money to users or merchants
3. **Withdrawals** - Transfer funds back to bank account
4. **Transaction Tracking** - Real-time updates and history

## 🛠 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes as part of a DBMS case study.

## 🆘 Support

For support or questions:
- Check the API documentation in the `/api` routes
- Review the component examples in `/src/components`
- Examine the database schema in `/src/db/schema.ts`

---

**Note**: This is a demonstration project for educational purposes. Not intended for production use without proper security audits and compliance checks for financial applications.