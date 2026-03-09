-- RUN THESE IN THE SUPABASE SQL EDITOR TO FIX MISMATCHES

-- 1. Create the missing Homework table
CREATE TABLE IF NOT EXISTS homework (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT,
    class_grade TEXT,
    division TEXT,
    description TEXT,
    assigned_by TEXT,
    due_date DATE,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Fix the Notices table (aligning with UI expectations)
-- If the table already exists, we add the missing columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notices' AND column_name='priority') THEN
        ALTER TABLE notices ADD COLUMN priority TEXT DEFAULT 'Medium';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notices' AND column_name='target') THEN
        ALTER TABLE notices ADD COLUMN target TEXT DEFAULT 'Global';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notices' AND column_name='date') THEN
        ALTER TABLE notices ADD COLUMN date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- 3. Ensure Staff table is ready
CREATE TABLE IF NOT EXISTS staff (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    subject TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
