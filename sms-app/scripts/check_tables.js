const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const tables = [
    'profiles', 'classes', 'sections', 'subjects', 'students', 'staff',
    'exams', 'results', 'attendance', 'admissions', 'notices', 'quizzes',
    'fees_payments', 'homework', 'leaves'
];

async function checkTables() {
    console.log("📊 Checking Table Existence in Supabase...");

    for (const table of tables) {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'count=exact'
            }
        });

        if (res.ok) {
            console.log(`✅ Table '${table}' exists.`);
        } else {
            const err = await res.json();
            if (err.code === 'PGRST205') {
                console.log(`❌ Table '${table}' DOES NOT EXIST.`);
            } else {
                console.log(`⚠️ Table '${table}' error: ${err.message}`);
            }
        }
    }
}

checkTables();
