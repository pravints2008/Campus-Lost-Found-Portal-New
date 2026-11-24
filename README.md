# Campus Lost & Found Portal 🎓🔍 (Full-Stack with Supabase)

> **"Lost something? Let's help you find it."**

A centralized, production-ready web application for college campuses to help students, faculty, and security personnel report, cross-reference, and recover lost belongings safely.

Connected to a real **Supabase PostgreSQL** cloud backend for user authentication, database persistence, image storage, and real-time synchronization.

---

## 🌟 Key Features

### 1. 🔐 Real Supabase Authentication
- **Student Registration**: Sign up with college email, password, full name, student/roll ID, and department.
- **Auto Profile Sync**: A PostgreSQL trigger (`on_auth_user_created`) automatically populates `public.profiles` upon account registration.
- **Secure Sessions**: Persistent JWT session management and user state with `@supabase/supabase-js`.
- **Role-Based Access**: Distinguishes between `student`, `staff`, and `admin` roles.

### 2. 🗄️ Full PostgreSQL Database Backend
- **`public.profiles`**: Stores student identity, department, student roll ID, contact details, and role.
- **`public.items`**: Stores all reported lost and found belongings with category, color, location, date, descriptions, images, and return status.
- **`public.claims`**: Stores match claim requests with verification notes submitted by students.
- **Row Level Security (RLS)**: Enforces database-level policies so users can only modify their own items or claims, while administrators have full desk moderation privileges.

### 3. ☁️ Supabase Cloud Storage
- Automated image uploads to the `item-images` bucket.
- Seamless public URL retrieval for lost and found photo attachments.
- Resilient fallback to base64 encoding if the storage bucket is still pending initial setup.

### 4. 🤖 Rule-Based Smart Matching Engine
- Real-time cross-referencing between reported lost items and turned-in found items.
- Dynamic scoring algorithm:
  - **Category Match**: +40 pts
  - **Colour Overlap**: +20 pts
  - **Campus Location**: +20 pts
  - **Keyword Tokenizer**: +15 pts
  - **Date Window Proximity**: +10 pts
- Displays confidence score percentage and criteria breakdown tags.
- Direct **"Express Interest / Claim Match"** workflow saving claims directly to the database.

### 5. 🛡️ Campus Helpdesk Admin Console (`/admin`)
- Real-time sync with PostgreSQL database.
- Search, filter, and review all active lost & found records.
- Approve claim requests and verify item returns (`Open` ➔ `Pending` ➔ `Returned`).
- Delete invalid or duplicate reports.

---

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL 15, Supabase Auth, Supabase Storage, Supabase Realtime)

---

## 🚀 Supabase Backend Setup Instructions

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New Project** and name it (e.g. `campus-lost-and-found`).
3. Set a database password and choose your nearest region.

### Step 2: Run the SQL Schema Script
1. In your Supabase project dashboard, navigate to **SQL Editor** on the left menu.
2. Click **New Query**.
3. Copy and paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) into the editor.
4. Click **Run** (Ctrl + Enter).
   - This sets up the `profiles`, `items`, and `claims` tables.
   - It configures Row Level Security (RLS) policies.
   - It sets up the `handle_new_user()` auto-profile trigger on `auth.users`.
   - It creates the `item-images` public storage bucket.

### Step 3: Get API Credentials
1. In your Supabase dashboard, click **Project Settings** (gear icon) ➔ **API**.
2. Copy the **Project URL** (`https://xyzcompany.supabase.co`).
3. Copy the **anon public** API key (`eyJhbGciOi...`).

### Step 4: Configure Local Environment
Create or edit your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

---

## 💻 Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit **`http://localhost:5173/`** in your browser.

---

## 🚢 Production Deployment (e.g. Vercel or Netlify)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
3. Add the Environment Variables under **Project Settings ➔ Environment Variables**:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
4. Deploy! Your app will be live with full backend integration.
