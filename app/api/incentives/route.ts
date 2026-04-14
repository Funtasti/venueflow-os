import { NextRequest, NextResponse } from 'next/server';
import { getIncentives } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const incentives = await getIncentives();
    const activeIncentives = incentives.filter(inc => inc.active);
    return NextResponse.json(activeIncentives);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
