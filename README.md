# VenueFlow OS

A production-ready platform engineered to improve physical event experiences at large-scale sporting venues. VenueFlow OS intelligently aggregates live density metrics, dynamically load-balances crowds with active flow incentives, and orchestrates real-time virtual queues.

## 🚀 Core Feature: Crowd Load Balancing & Flow Incentives

Most apps just tell you a line is long. VenueFlow OS proactively *fixes* the line. By analyzing current occupancy across all venue zones (Heatmaps), the system injects limited-time Flow Incentives (e.g. "10% off Merch at South Gate right now") when it detects an under-utilized quadrant — pulling attendees away from congested choke-points.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Vanilla CSS + CSS Modules |
| ORM | Prisma (PostgreSQL) with JSON file fallback |
| Real-time | SWR / Polling Hooks |
| Testing | Jest + React Testing Library |
| Deployment | Docker → Google Cloud Run |

## 📂 Project Structure

```text
venueflow-os/
├── app/               # Next.js App Router (Pages & API Routes)
│   ├── api/           # REST endpoints (zones, queues, incidents, incentives)
│   ├── staff/         # Staff-facing Incident Command Center
│   └── globals.css    # Design tokens, glassmorphism variables
├── components/        # Reusable UI components (Button, Card, Navbar)
├── data/              # Local JSON DB fallback (db.json)
├── hooks/             # Custom hooks (useVenueData)
├── lib/               # Database abstraction layer (Prisma + JSON fallback)
├── prisma/            # Prisma schema & seed script
└── __tests__/         # Unit & component tests
```

## ⚙️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template
cp .env.example .env

# 3. Start the dev server
npm run dev
```

| Page | URL |
|---|---|
| Attendee Dashboard | `http://localhost:3000/` |
| Staff Command Center | `http://localhost:3000/staff` |

### Running Tests

```bash
npx jest
```

### With PostgreSQL (optional)

Set `DATABASE_URL` in your `.env` to a Postgres connection string. Then:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## ☁️ Deploying to Google Cloud Run

### Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A GCP project with billing enabled
- (Optional) A Cloud SQL PostgreSQL instance

### Quick Deploy

```bash
# Set your GCP project
gcloud config set project YOUR_PROJECT_ID

# Deploy directly from source (Cloud Build + Cloud Run)
gcloud run deploy venueflow-os \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### With PostgreSQL on Cloud SQL

```bash
# 1. Create a Cloud SQL instance (if you don't have one)
gcloud sql instances create venueflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# 2. Create the database
gcloud sql databases create venueflow --instance=venueflow-db

# 3. Deploy with DATABASE_URL
gcloud run deploy venueflow-os \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "DATABASE_URL=postgresql://USER:PASSWORD@/venueflow?host=/cloudsql/PROJECT:REGION:venueflow-db" \
  --add-cloudsql-instances PROJECT:REGION:venueflow-db
```

### Manual Docker Build (alternative)

```bash
# Build the container
docker build -t venueflow-os .

# Test locally
docker run -p 8080:8080 venueflow-os

# Tag and push to Artifact Registry
gcloud artifacts repositories create venueflow --repository-format=docker --location=us-central1
docker tag venueflow-os us-central1-docker.pkg.dev/YOUR_PROJECT_ID/venueflow/venueflow-os
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/venueflow/venueflow-os

# Deploy from the image
gcloud run deploy venueflow-os \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/venueflow/venueflow-os \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

## 🛡️ Security, Testing & Accessibility

- **Zero secrets in the repo** — `.env` is gitignored; `.env.example` is committed as a template.
- **API validation** — POST endpoints validate payloads before processing.
- **Accessibility first** — Semantic HTML landmarks, WCAG-level contrast ratios, `focus-visible` rings on all interactive elements.
- **Testing** — Jest + React Testing Library for component and API verification.

## 🔭 Future Improvements

1. **WebSocket real-time updates** — Replace polling with persistent connections for sub-second latency.
2. **Authentication** — NextAuth / Clerk integration to secure the `/staff` route with JWTs.
3. **Geo-fencing** — Google Maps SDK or BLE beacons to auto-queue attendees approaching a zone.
