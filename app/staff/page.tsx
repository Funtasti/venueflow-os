'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Card, CardContent, CardHeader } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import styles from './page.module.css';
import { AlertCircle, CheckCircle, ShieldAlert, Users } from 'lucide-react';
import type { Incident, Zone } from '@/lib/db';

export default function StaffDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    try {
      const [incRes, zRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/zones')
      ]);
      if (incRes.ok) setIncidents(await incRes.json());
      if (zRes.ok) setZones(await zRes.json());
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStaffData();
    const interval = setInterval(fetchStaffData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <><Navbar /><p style={{textAlign: 'center', marginTop: '2rem'}}>Loading control center...</p></>;

  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const activeIncidents = incidents.filter(i => i.status === 'Active');

  return (
    <>
      <Navbar />
      <main className={`${styles.main} animate-in`}>
        <div className={styles.header}>
          <h1 className={styles.title}><ShieldAlert color="var(--accent-primary)"/> Operations Command Center</h1>
          <Button variant="danger">Trigger Emergency Protocol</Button>
        </div>

        <div className={styles.grid}>
          {/* Main KPI Dashboard */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <Card>
                <CardContent style={{ textAlign: 'center' }}>
                  <Users size={32} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}}/>
                  <h3 style={{ fontSize: '2rem', margin: 0 }}>{totalOccupancy}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Total Attendees (Max {totalCapacity})</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent style={{ textAlign: 'center' }}>
                  <AlertCircle size={32} color="var(--status-crowded)" style={{marginBottom: '0.5rem'}}/>
                  <h3 style={{ fontSize: '2rem', margin: 0 }}>{activeIncidents.length}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Active Incidents</p>
                </CardContent>
              </Card>
            </div>

            <h2>Live Zones</h2>
            <Card style={{ marginTop: '1rem' }}>
              <CardContent>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '0.5rem' }}>Zone</th>
                      <th style={{ padding: '0.5rem' }}>Occupancy</th>
                      <th style={{ padding: '0.5rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map(z => (
                      <tr key={z.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{z.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{z.currentOccupancy} / {z.capacity}</td>
                        <td style={{ padding: '0.75rem 0.5rem', color: `var(--status-${z.status.toLowerCase()})` }}>{z.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Incident Management */}
          <div>
            <h2>Incident Log</h2>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incidents.length === 0 ? (
                <p>No incidents reported.</p>
              ) : (
                incidents.map(inc => (
                  <Card key={inc.id} className={`${styles.incidentCard} ${inc.urgency === 'High' ? styles.incidentHigh : ''}`}>
                    <CardHeader 
                      title={`${inc.type} Alert`} 
                      description={`Location: ${zones.find(z => z.id === inc.location)?.name || inc.location}`} 
                    />
                    <CardContent>
                      <div className={styles.incidentMeta}>
                        <span>Status: {inc.status}</span>
                        <span>Assigned: {inc.assignedStaff}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
