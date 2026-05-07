Team Task Manager

A modern role-based team collaboration and task management application built with Next.js 15, TypeScript, Tailwind CSS, Supabase Authentication, Prisma ORM, and SQLite.

🚀 Overview

Team Task Manager helps teams efficiently manage projects, assign tasks, and track progress in real time. The platform provides secure authentication, role-based access control, project management, task tracking, and dashboard analytics through a clean and responsive user interface.

Admins can manage projects and tasks, assign work to team members, and monitor team productivity, while Members can view and update their assigned tasks.

✨ Features

🔐 Supabase Email/Password Authentication
👤 Role-Based Access Control (Admin & Member)
📁 Project Management
✅ Task Creation, Assignment & Status Tracking
📊 Dashboard Analytics
📱 Fully Responsive UI
⚡ Fast Next.js 15 App Router Architecture
🎨 Modern Tailwind CSS Design
🗄️ Prisma ORM with SQLite Database
🚀 Vercel Deployment Ready

🛠️ Tech Stack

Frontend
Next.js 15 App Router
TypeScript
Tailwind CSS
Backend
Next.js API Routes
Prisma ORM
SQLite Database
Authentication
Supabase Authentication
Deployment
Vercel

📂 Project Structure
app/
 ├── api/
 ├── dashboard/
 ├── projects/
 ├── tasks/
 └── auth/

components/
lib/
prisma/
public/
styles/

🔑 User Roles

Admin
Create, edit, and delete projects
Create, assign, update, and delete tasks
View all projects and tasks
Access dashboard analytics
Member
View assigned tasks
Update task status
Track task progress

⚙️ Environment Variables

Create a .env file in the root directory:

DATABASE_URL="file:./dev.db"

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"

NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

ADMIN_EMAILS="admin@example.com"

📦 Installation

1. Clone the Repository
git clone <your-repository-url>
cd team-task-manager
2. Install Dependencies
npm install
3. Generate Prisma Client
npm run prisma:generate
4. Initialize Database
npm run db:init
5. Start Development Server
npm run dev

Open:

http://localhost:3000

🗄️ Prisma Commands

npm run prisma:generate

npm run prisma:migrate -- --name init

npm run prisma:deploy

npm run prisma:studio

🔐 Supabase Setup

Create a Supabase project
Enable Email Authentication
Copy:
Project URL
Anon Public Key
Add them to .env
Add admin email to:
ADMIN_EMAILS="admin@example.com"

📡 API Routes

Authentication
GET /api/auth
POST /api/auth
GET /api/auth/profile
POST /api/auth/profile
Projects
GET /api/projects
POST /api/projects
PATCH /api/projects/[id]
DELETE /api/projects/[id]
Tasks
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/[id]
DELETE /api/tasks/[id]
Dashboard
GET /api/dashboard
GET /api/dashboard/stats

🚀 Deployment

Deploy on Vercel
Push the project to GitHub
Import repository into Vercel
Add Environment Variables:
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ADMIN_EMAILS
Build Command:
npm run build
Deploy the project

📸 Highlights
Clean and modern UI
Secure authentication flow
Scalable full-stack architecture
Easy task collaboration
Beginner-friendly code structure

📄 License

This project is created for educational and productivity purposes.

👨‍💻 Developer

Developed by Thahaseen Gulam
