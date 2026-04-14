import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VenueFlow OS | Dynamic Event Management',
  description: 'Smart routing, virtual queues, and heatmaps for large-scale venues.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
