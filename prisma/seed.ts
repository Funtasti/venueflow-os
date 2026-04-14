// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const z1 = await prisma.zone.create({
    data: { id: 'z1', name: 'North Gate Entry', capacity: 500, currentOccupancy: 450, status: 'Crowded' }
  });
  const z2 = await prisma.zone.create({
    data: { id: 'z2', name: 'Food Court A', capacity: 300, currentOccupancy: 200, status: 'Moderate' }
  });
  const z3 = await prisma.zone.create({
    data: { id: 'z3', name: 'Merch Stand West', capacity: 100, currentOccupancy: 15, status: 'Low' }
  });
  const z4 = await prisma.zone.create({
    data: { id: 'z4', name: 'Restroom Section 102', capacity: 50, currentOccupancy: 48, status: 'Crowded' }
  });
  const z5 = await prisma.zone.create({
    data: { id: 'z5', name: 'South Gate Entry', capacity: 500, currentOccupancy: 120, status: 'Low' }
  });

  await prisma.queue.createMany({
    data: [
      { id: 'q1', zoneId: 'z2', type: 'Food', estimatedWaitTime: 15, activeTickets: 10 },
      { id: 'q2', zoneId: 'z3', type: 'Merch', estimatedWaitTime: 2, activeTickets: 1 },
      { id: 'q3', zoneId: 'z4', type: 'Restroom', estimatedWaitTime: 5, activeTickets: 5 }
    ]
  });

  await prisma.incident.create({
    data: { id: 'i1', location: 'z1', type: 'Security', assignedStaff: 'Bob', urgency: 'High', status: 'Active' }
  });

  await prisma.incentive.create({
    data: { id: 'inc1', targetZoneId: 'z5', description: '10% off at Food Court B (South Gate)', active: true }
  });
  
  console.log("Database seeded!");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
