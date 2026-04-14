import { NextRequest, NextResponse } from 'next/server';
import { getIncidents, readDbFallback, writeDbFallback, hasPostgres, prisma, Incident } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const incidents = await getIncidents();
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, type, urgency } = body;
    
    if (!location || !type || !urgency) {
      return NextResponse.json({ error: 'Missing incident fields' }, { status: 400 });
    }

    if (hasPostgres) {
      const newIncident = await prisma.incident.create({
        data: { location, type, urgency, assignedStaff: 'Unassigned', status: 'Active' }
      });
      return NextResponse.json({ success: true, incident: newIncident });
    } else {
      const db = await readDbFallback();
      const newIncident: Incident = {
        id: `i${Date.now()}`,
        location,
        type,
        assignedStaff: 'Unassigned',
        status: 'Active',
        urgency,
        timestamp: new Date().toISOString()
      };
      
      db.incidents.push(newIncident);
      await writeDbFallback(db);
      return NextResponse.json({ success: true, incident: newIncident });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
