# AI Employee Dashboard

A production-grade Next.js 15 web application that serves as the visual interface, monitoring hub, and human-in-the-loop control panel for an autonomous AI agent system (Personal AI Employee).

## Features

- **Real-time AI Status** - Always know what Claude is doing right now
- **Human-in-the-Loop Approvals** - Drag-to-approve UX for sensitive actions
- **Ralph Wiggum Progress** - Visual representation of Claude's multi-step task iterations
- **Monday CEO Briefings** - Beautifully rendered business intelligence reports
- **Full Audit Trail** - Every AI action logged and searchable
- **Dual Theme** - Dark mode primary, light mode equally polished

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Tables:** TanStack Table v8
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Drag & Drop:** dnd-kit
- **Theme:** next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME="AI Employee Dashboard"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## Pages

| Page | Description |
|------|-------------|
| `/dashboard` | Command center with stats, watcher status, and activity feed |
| `/inbox` | Needs Action feed - tasks requiring human attention |
| `/approvals` | Human-in-the-Loop approval workflow with drag-to-approve |
| `/plans` | Claude's multi-step plans with Ralph Wiggum progress |
| `/briefings` | Weekly CEO briefings with business intelligence |
| `/accounting` | Financial overview with transactions and charts |
| `/logs` | Complete audit trail of all system actions |
| `/settings` | Configuration for handbook, goals, and system |

## Development Commands

```bash
# Development
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

## Architecture

```
┌─────────────────────────────────────────┐
│         AI Employee Dashboard           │
│         (Next.js 15 Frontend)           │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │     Zustand Store               │    │
│  │  - AI State                     │    │
│  │  - Watchers                     │    │
│  │  - Stats                        │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │     TanStack Query Cache        │    │
│  │  - Tasks                        │    │
│  │  - Approvals                    │    │
│  │  - Plans                        │    │
│  │  - Logs                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
              │ HTTP / WebSocket
              ▼
┌─────────────────────────────────────────┐
│         Backend API                     │
│    (Express + Socket.io Server)         │
└─────────────────────────────────────────┘
```

## Demo Mode

The application runs in demo mode by default (`NEXT_PUBLIC_DEMO_MODE=true`), which:
- Uses mock data from `lib/mock-data.ts`
- Simulates real-time updates with intervals
- No backend connection required

To connect to a real backend:
1. Set `NEXT_PUBLIC_DEMO_MODE=false`
2. Configure `NEXT_PUBLIC_API_URL` to your backend
3. Ensure backend implements the API endpoints

## API Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| PATCH | `/api/tasks/:id` | Update task status |
| GET | `/api/approvals` | List approvals |
| POST | `/api/approvals/:id/approve` | Approve item |
| POST | `/api/approvals/:id/reject` | Reject item |
| GET | `/api/plans` | List plans |
| GET | `/api/briefings` | List briefings |
| GET | `/api/accounting/transactions` | List transactions |
| GET | `/api/logs` | List audit logs |
| GET | `/api/system/status` | Get AI system status |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `Cmd+D` | Go to Dashboard |
| `Cmd+I` | Go to Inbox |
| `Cmd+A` | Go to Approvals |
| `?` | Show keyboard shortcuts |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run build`
5. Submit a pull request

## License

MIT
