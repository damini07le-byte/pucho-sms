// Comprehensive Seeding Script for Homework, Exams, and Staff
// Uses global fetch (Node 18+)
const SUPABASE_URL = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function db(table, method = 'POST', body = null) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) {
        const text = await res.text();
        console.error(`Error in ${table}: ${text}`);
        return null;
    }
    return res.json();
}

const classes = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

async function seed() {
    console.log("🚀 Starting Corrected Seeding...");

    // 1. Seed Staff (Directly using employee_id PK)
    console.log("👥 Seeding Staff...");
    const staffToSeed = [];
    for (let i = 1; i <= 5; i++) {
        staffToSeed.push({
            employee_id: `EMP-00${i}`,
            name: `Teacher ${i} (Real)`,
            role: 'Teacher',
            subject: i % 2 === 0 ? 'Mathematics' : 'Science',
            email: `teacher${i}@pucho.ai`
        });
    }
    await db('staff', 'POST', staffToSeed);

    // 2. Seed Exams
    console.log("📝 Seeding Exams...");
    const examsToSeed = [];
    classes.forEach((cls) => {
        examsToSeed.push({
            id: crypto.randomUUID(),
            class: cls,
            subject: 'Mathematics',
            start_date: '2026-04-15',
            time: '10:00 AM',
            venue: 'Main Hall'
        });
    });
    await db('exams', 'POST', examsToSeed);

    // 3. Seed Homework
    console.log("📚 Seeding Homework...");
    const homeworkToSeed = [];
    classes.forEach((cls) => {
        homeworkToSeed.push({
            id: `HW-${cls.toUpperCase().replace(/\s/g, '')}-${Date.now().toString(36)}`,
            title: `Practice Sheet - ${cls}`,
            subject: 'English',
            class_grade: cls,
            division: 'A',
            description: `Weekly homework assignment for ${cls}.`,
            assigned_by: 'Headmaster',
            due_date: '2026-03-25'
        });
    });
    await db('homework', 'POST', homeworkToSeed);

    console.log("✅ Seeding Complete!");
}

seed().catch(console.error);
