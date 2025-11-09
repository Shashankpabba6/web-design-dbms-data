import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            userId: '2E3BCE0423',
            name: 'P SHASHANK',
            email: 'shashank@example.com',
            phone: '+91-9876543200',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'USER002',
            name: 'Rahul Kumar',
            email: 'rahul@example.com',
            phone: '+91-9876543201',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'USER003',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91-9876543202',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'USER004',
            name: 'Amit Patel',
            email: 'amit@example.com',
            phone: '+91-9876543203',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});