const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function db(table, method, body, query = '') {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
        const err = await response.text();
        return { error: err, status: response.status };
    }
    return { data: await response.json() };
}

async function updateMaharashtraBoardSubjects() {
    console.log("🧹 Clearing old subjects...");
    const cleanRes = await fetch(`${supabaseUrl}/rest/v1/subjects`, {
        method: 'DELETE',
        headers: headers
    });

    if (!cleanRes.ok) {
        console.error("Failed to delete old subjects", await cleanRes.text());
        return;
    }
    console.log("✅ Cleared old subjects.");

    const subjectMap = [
        // Pre-primary
        { classes: ['Nursery', 'LKG', 'UKG'], subjects: ['English', 'Mathematics', 'General Awareness', 'Rhymes & Stories'] },
        // Primary
        { classes: ['1st', '2nd', '3rd', '4th', '5th'], subjects: ['English', 'Marathi', 'Hindi', 'Mathematics', 'Environmental Studies (EVS)'] },
        // Middle / Upper Primary
        { classes: ['6th', '7th', '8th'], subjects: ['English', 'Marathi', 'Hindi', 'Mathematics', 'General Science', 'History & Civics', 'Geography'] },
        // Secondary
        { classes: ['9th', '10th'], subjects: ['English', 'Marathi', 'Hindi', 'Mathematics Part-I', 'Mathematics Part-II', 'Science Part-I', 'Science Part-II', 'History & Political Science', 'Geography'] }
    ];

    console.log("🚀 Seeding Maharashtra Board Subjects...");
    const toInsert = [];

    for (const group of subjectMap) {
        for (const clsName of group.classes) {
            for (const subName of group.subjects) {
                toInsert.push({
                    name: subName,
                    class: clsName,
                    code: `${subName.substring(0, 3).toUpperCase()}-${clsName.replace(/[^a-zA-Z0-9]/g, '')}`
                });
            }
        }
    }

    // Insert in chunks or altogether
    const res = await db('subjects', 'POST', toInsert);
    if (res.error) {
        console.error("❌ Failed to insert subjects:", res.error);
    } else {
        console.log(`✅ Successfully inserted ${toInsert.length} subjects for MH Board!`);
    }
}

updateMaharashtraBoardSubjects();
