const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

async function probe() {
    console.log("🚀 Probing Homework Table Schema...");

    const res = await fetch(`${supabaseUrl}/rest/v1/homework?select=*&limit=1`, {
        method: 'GET',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
            console.log("✅ Homework data found:", data[0]);
            console.log("Columns:", Object.keys(data[0]).join(', '));
        } else {
            console.log("Table is empty. Trying a sample insert to test schema...");
            const sample = {
                id: "TEST-HW-" + Date.now(),
                title: "Schema Probe",
                subject: "None"
            };
            const postRes = await fetch(`${supabaseUrl}/rest/v1/homework`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(sample)
            });
            if (postRes.ok) {
                const inserted = await postRes.json();
                console.log("✨ Inserted sample homework:", inserted[0]);
            } else {
                console.error("❌ Failed to insert homework sample:", await postRes.text());
            }
        }
    } else {
        console.error("❌ Failed to access 'homework' table:", await res.text());
    }
}

probe();
