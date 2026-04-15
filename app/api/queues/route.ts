import { NextRequest, NextResponse } from 'next/server';
import { getQueues, prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const queues = await getQueues();
    return NextResponse.json(queues);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zoneId, type } = body;
    
    if (!zoneId || !type) {
      return NextResponse.json({ error: 'Missing zoneId or type' }, { status: 400 });
    }

    // Postgres execution via Prisma
    const queue = await prisma.queue.findFirst({ where: { zoneId, type } });
    if (queue) {
      const updated = await prisma.queue.update({
        where: { id: queue.id },
        data: { 
          activeTickets: queue.activeTickets + 1, 
          estimatedWaitTime: queue.estimatedWaitTime + 2 
        }
      });
      return NextResponse.json({ success: true, queue: updated });
    } else {
      const newQueue = await prisma.queue.create({
        data: { 
          zoneId, 
          type, 
          estimatedWaitTime: 5, 
          activeTickets: 1 
        }
      });
      return NextResponse.json({ success: true, queue: newQueue });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
