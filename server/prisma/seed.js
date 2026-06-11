"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const vehicles = [
    {
        name: 'Toyota Vios #1',
        category: client_1.VehicleCategory.FOUR_SEATER,
        description: 'Compact sedan, automatic transmission. Fuel-efficient and easy to drive around the city.',
        imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Toyota Vios #2',
        category: client_1.VehicleCategory.FOUR_SEATER,
        description: 'Compact sedan, automatic transmission. Pearl white finish.',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Mitsubishi Mirage G4 #1',
        category: client_1.VehicleCategory.FOUR_SEATER,
        description: 'Subcompact sedan, automatic. Great fuel economy for long drives.',
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1280&q=80',
        status: client_1.VehicleStatus.MAINTENANCE,
    },
    {
        name: 'Toyota Innova #1',
        category: client_1.VehicleCategory.SEVEN_SEATER,
        description: 'Spacious 7-seater MPV, diesel, automatic. Perfect for family trips.',
        imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Toyota Avanza #1',
        category: client_1.VehicleCategory.SEVEN_SEATER,
        description: '7-seater compact MPV, automatic. Nimble in the city with room for everyone.',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Yamaha NMAX #1',
        category: client_1.VehicleCategory.BIKE,
        description: '155cc automatic scooter. Comfortable commuter with ample storage.',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Honda Click 125i #1',
        category: client_1.VehicleCategory.BIKE,
        description: '125cc automatic scooter. Lightweight and fuel-efficient.',
        imageUrl: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1280&q=80',
        status: client_1.VehicleStatus.AVAILABLE,
    },
    {
        name: 'Honda XRM 125 #1',
        category: client_1.VehicleCategory.BIKE,
        description: '125cc underbone. Retired from the active fleet.',
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1280&q=80',
        status: client_1.VehicleStatus.RETIRED,
    },
];
async function main() {
    await prisma.appSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            maxAdvanceBookingDays: 7,
            maxActiveBookingsPerUser: 2,
            minHoursBeforeBooking: 24,
            cancellationWindowHours: 24,
        },
    });
    for (const vehicle of vehicles) {
        await prisma.vehicle.upsert({
            where: { name: vehicle.name },
            update: vehicle,
            create: vehicle,
        });
    }
    await prisma.user.upsert({
        where: { email: 'admin@zrentals.example.com' },
        update: {},
        create: {
            firebaseUid: 'seed-admin-placeholder',
            email: 'admin@zrentals.example.com',
            displayName: 'Z Rentals Admin',
            photoUrl: 'https://i.pravatar.cc/150?img=33',
            role: client_1.Role.ADMIN,
            isActive: true,
        },
    });
    console.log('Seed complete: settings, 8 vehicles, admin user placeholder');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map