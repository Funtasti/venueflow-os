'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RadioTower, Users } from 'lucide-react';
import styles from './Navbar.module.css';
import classNames from 'classnames';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <Link href="/" className={styles.logo}>
        <RadioTower className={styles.logoIcon} size={28} />
        <span>VenueFlow OS</span>
      </Link>
      
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={classNames(styles.link, { [styles.active]: pathname === '/' })}
        >
          Attendee
        </Link>
        <Link 
          href="/staff" 
          className={classNames(styles.link, { [styles.active]: pathname === '/staff' })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} />
            <span>Staff Dashboard</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
