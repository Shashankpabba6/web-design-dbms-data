import { db } from '@/db';
import { wallets } from '@/db/schema';

async function main() {
    const sampleWallets = [
        {
            userId: '2E3BCE0423',
            balance: 12458.50,
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'USER002',
            balance: 5000.00,
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'USER003',
            balance: 8500.00,
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'USER004',
            balance: 3200.00,
            currency: 'INR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(wallets).values(sampleWallets);
    
    console.log('✅ Wallets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});