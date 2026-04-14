import { NextRequest, NextResponse } from 'next/server';
import { getZones } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const zones = await getZones();
    return NextResponse.json(zones);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
