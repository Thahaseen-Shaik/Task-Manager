# Team Task Manager

A complete role-based team task manager built with Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase Authentication, Prisma ORM, and SQLite.

## Features

- Supabase email/password authentication
- Admin and Member role access
- Project create, edit, and delete
- Task create, edit, delete, assignment, and status updates
- Member view limited to assigned tasks
- Dashboard analytics
- Responsive Tailwind UI
- Vercel deployment ready

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Prisma ORM
- SQLite

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Fill in `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[SUPABASE-ANON-KEY]"
ADMIN_EMAILS="admin@example.com"
```

4. Generate Prisma Client:

```bash
npm run prisma:generate
```

5. Create the SQLite database tables for local development:

```bash
npm run db:init
```

You can also use Prisma migrations when the Prisma schema engine works on your machine:

```bash
npx prisma migrate deploy
```

6. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Go to `Authentication > Providers` and enable Email.
3. Go to `Project Settings > API` and copy:
   - Project URL into `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add your first admin email to `ADMIN_EMAILS`.

The first signed-in user also becomes Admin automatically, which helps initial setup.

## Roles

Admin users can:

- Create, edit, and delete projects
- Create, edit, and delete tasks
- Assign tasks to members
- View all tasks

Member users can:

- View assigned tasks
- Update task status only

## API Routes

- `GET /api/auth`
- `POST /api/auth`
- `GET /api/auth/profile`
- `POST /api/auth/profile`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/[id]`
- `PATCH /api/projects/[id]`
- `DELETE /api/projects/[id]`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/[id]`
- `DELETE /api/tasks/[id]`
- `GET /api/dashboard`
- `GET /api/dashboard/stats`

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:deploy
npm run prisma:studio
```

Use `npm run prisma:deploy` in production to apply existing migrations.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add these Environment Variables in Vercel:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAILS`
4. Set the build command to:

```bash
npm run build
```

5. Deploy.

If migrations have not been applied yet, run locally:

```bash
npm run prisma:migrate -- --name init
```

For production database migration from CI or Vercel, use:

```bash
npm run prisma:deploy
```

## Notes

- Supabase handles authentication sessions through secure cookies.
- Prisma stores app users, roles, projects, and tasks in SQLite.
- `ADMIN_EMAILS` is comma-separated. Example: `owner@app.com,lead@app.com`.
