-- PUCHO SMS SUPABASE SCHEMA
-- Copy and paste this into the Supabase SQL Editor

-- 1. Profiles Table (Linked to Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'staff', 'teacher', 'parent', 'student')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sections
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'A', 'B'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    class TEXT, -- Denormalized for easier lookups
    code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    admission_no TEXT UNIQUE NOT NULL,
    roll_no INT,
    section_id UUID REFERENCES sections(id),
    status TEXT DEFAULT 'Active',
    gender TEXT,
    dob DATE,
    parent_id UUID, -- Can reference another profile
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Staff
CREATE TABLE IF NOT EXISTS staff (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    subject TEXT,
    email TEXT UNIQUE,
    password TEXT, -- For legacy auth compatibility
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Exams
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT,
    subject TEXT,
    date DATE,
    time TEXT,
    venue TEXT,
    exam_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Results
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id),
    subject_id UUID REFERENCES subjects(id),
    marks FLOAT,
    total FLOAT,
    grade TEXT,
    exam_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id),
    date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Admissions/Inquiries
CREATE TABLE IF NOT EXISTS admissions (
    id TEXT PRIMARY KEY, -- ADM-YYYY-XXXX
    student_name TEXT,
    parent_name TEXT,
    grade TEXT,
    dob DATE,
    phone TEXT,
    status TEXT DEFAULT 'Pending',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    parent_email TEXT,
    docs JSONB
);

-- 11. Notices & Announcements
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    date DATE DEFAULT CURRENT_DATE,
    target TEXT DEFAULT 'Global',
    priority TEXT DEFAULT 'Medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT,
    class TEXT,
    division TEXT,
    type TEXT,
    date DATE,
    total_marks INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Fees & Payments
CREATE TABLE IF NOT EXISTS fees_payments (
    id TEXT PRIMARY KEY,
    student_id UUID REFERENCES profiles(id),
    type TEXT,
    amount FLOAT,
    status TEXT DEFAULT 'Pending',
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Homework
CREATE TABLE IF NOT EXISTS homework (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT,
    class_grade TEXT,
    division TEXT,
    description TEXT,
    assigned_by TEXT,
    due_date DATE,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Leaves
CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    user_name TEXT,
    user_role TEXT,
    reason TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'Pending',
    target_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS DISABLE (For rapid setup/testing - RE-ENABLE in production)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Repeat for other tables if needed, or create permissive policies
