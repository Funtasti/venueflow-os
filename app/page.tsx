'use client';
import { useVenueData } from '@/hooks/useVenueData';
import { Card, CardContent, CardHeader } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';
import { Activity, Clock, Flame, Map, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { zones, queues, incentives, loading, refetch } = useVenueData();
  const [activeTicket, setActiveTicket] = useState<{ zoneName: string, type: string, waitTime: number } | null>(null);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
          <p>Loading real-time venue data...</p>
        </div>
      </>
    );
  }

  const handleJoinQueue = async (zoneId: string, type: string, zoneName: string, waitTime: number) => {
    try {
      await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneId, type })
      });
      refetch(); // Fast refresh
      
      // Interactive Ticket Toast Trigger
      setActiveTicket({ zoneName, type, waitTime });
      setTimeout(() => setActiveTicket(null), 5000); // Hide after 5 seconds
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Navbar />
      <main className={`${styles.main} animate-in`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Venueflow Attendee Experience</h1>
          <p className={styles.subtitle}>Navigate the venue. Skip the lines. Gain rewards.</p>
        </div>

        {incentives.map(inc => (
          <div key={inc.id} className={styles.incentiveBanner}>
            <div className={styles.incentiveContent}>
              <h4><Zap size={18}/> Active Flow Incentive!</h4>
              <p>{inc.description}</p>
            </div>
            <Button size="sm">Claim</Button>
          </div>
        ))}

        <div className={styles.grid}>
          {/* Main Map / Zone list */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Map /> Live Density Map</h2>
            <Card>
              <CardContent>
                <div className={styles.zoneList}>
                  {zones.map(zone => (
                    <div key={zone.id} className={styles.zoneItem}>
                      <div className={styles.zoneInfo}>
                        <h4>{zone.name}</h4>
                        <p>{zone.currentOccupancy} / {zone.capacity} capacity</p>
                      </div>
                      <span className={`${styles.zoneBadge} ${styles[`badge${zone.status}`]}`}>
                        {zone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Virtual Queues */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}><Clock /> Virtual Queues</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {queues.map(queue => {
                const zoneName = zones.find(z => z.id === queue.zoneId)?.name || 'Unknown Zone';
                return (
                  <Card key={queue.id} hoverable>
                    <CardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{queue.type}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{zoneName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                            {queue.estimatedWaitTime}m
                          </span>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>est. wait</p>
                        </div>
                      </div>
                      <Button fullWidth onClick={() => handleJoinQueue(queue.zoneId, queue.type, zoneName, queue.estimatedWaitTime)}>
                        Join Queue
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Interactive Floating Ticket */}
      <div className={`${styles.toastOverlay} ${activeTicket ? styles.visible : ''}`}>
        <CheckCircle color="var(--status-low)" size={40} />
        <div className={styles.toastTicket}>
          <strong>Queue Joined!</strong>
          <span>{activeTicket?.type} at {activeTicket?.zoneName}</span>
          <span>Estimated wait: {activeTicket?.waitTime} mins. Head over now!</span>
        </div>
      </div>
    </>
  );
}
