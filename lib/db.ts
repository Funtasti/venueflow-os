import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Keep mock types intact for JSON execution
export type ZoneStatus = 'Low' | 'Moderate' | 'Crowded';
export type IncidentStatus = 'Active' | 'Resolved';

export interface Zone { id: string; name: string; capacity: number; currentOccupancy: number; status: ZoneStatus; }
export interface Queue { id: string; zoneId: string; type: string; estimatedWaitTime: number; activeTickets: number; }
export interface Incident { id: string; location: string; type: string; assignedStaff: string; status: IncidentStatus; urgency: string; timestamp: string; }
export interface Incentive { id: string; targetZoneId: string; description: string; active: boolean; }

export interface DatabaseSchema {
  zones: Zone[];
  queues: Queue[];
  incidents: Incident[];
  incentives: Incentive[];
}

// Fallback logic check
export const hasPostgres = !!process.env.DATABASE_URL;

// Lazy Prisma instance — only created when DATABASE_URL is set and first accessed.
// This prevents build-time crashes when no database is configured.
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});
const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Export read DB generic enough for both systems using abstraction
export const getZones = async (): Promise<Zone[]> => {
  if (hasPostgres) return await prisma.zone.findMany() as any;
  const data = await readDbFallback();
  return data.zones;
}

export const getQueues = async (): Promise<Queue[]> => {
  if (hasPostgres) return await prisma.queue.findMany() as any;
  return (await readDbFallback()).queues;
}

export const getIncidents = async (): Promise<Incident[]> => {
  if (hasPostgres) return await prisma.incident.findMany() as any;
  return (await readDbFallback()).incidents;
}

export const getIncentives = async (): Promise<Incentive[]> => {
  if (hasPostgres) return await prisma.incentive.findMany() as any;
  return (await readDbFallback()).incentives;
}

export const readDbFallback = async (): Promise<DatabaseSchema> => {
  try {
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (e) {
    return { zones: [], queues: [], incidents: [], incentives: [] };
  }
};

export const writeDbFallback = async (data: DatabaseSchema): Promise<void> => {
  await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
};
