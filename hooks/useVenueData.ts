import { useState, useEffect } from 'react';
import type { Zone, Queue, Incentive } from '@/lib/db';

export function useVenueData() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [zonesRes, queuesRes, incRes] = await Promise.all([
        fetch('/api/zones'),
        fetch('/api/queues'),
        fetch('/api/incentives')
      ]);

      if (zonesRes.ok) setZones(await zonesRes.json());
      if (queuesRes.ok) setQueues(await queuesRes.json());
      if (incRes.ok) setIncentives(await incRes.json());
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch venue data', err);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds to simulate real-time
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { zones, queues, incentives, loading, refetch: fetchData };
}
