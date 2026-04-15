import { NextRequest, NextResponse } from 'next/server';
import { getIncidents, prisma } from '@/lib/db';

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

    const newIncident = await prisma.incident.create({
      data: { 
        location, 
        type, 
        urgency, 
        assignedStaff: 'Unassigned', 
        status: 'Active' 
      }
    });
    return NextResponse.json({ success: true, incident: newIncident });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
