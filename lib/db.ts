import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

// Keep mock types intact
export type ZoneStatus = 'Low' | 'Moderate' | 'Crowded';
export type IncidentStatus = 'Active' | 'Resolved';

export interface Zone { id: string; name: string; capacity: number; currentOccupancy: number; status: ZoneStatus; }
export interface Queue { id: string; zoneId: string; type: string; estimatedWaitTime: number; activeTickets: number; }
export interface Incident { id: string; location: string; type: string; assignedStaff: string; status: IncidentStatus; urgency: string; timestamp: string; }
export interface Incentive { id: string; targetZoneId: string; description: string; active: boolean; }

// Lazy Prisma instance — only created when DATABASE_URL is set and first accessed.
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Database connection failed.');
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma!;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export const getZones = async (): Promise<Zone[]> => {
  return await prisma.zone.findMany() as any;
}

export const getQueues = async (): Promise<Queue[]> => {
  return await prisma.queue.findMany() as any;
}

export const getIncidents = async (): Promise<Incident[]> => {
  return await prisma.incident.findMany() as any;
}

export const getIncentives = async (): Promise<Incentive[]> => {
  return await prisma.incentive.findMany() as any;
}

