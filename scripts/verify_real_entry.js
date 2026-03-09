const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

async function verify() {
    console.log("🚀 Verifying Supabase Schema & Real Data Entry...");

    // 1. Probe Notices Schema
    console.log("Probing 'notices' table schema...");
    const probeRes = await fetch(`${supabaseUrl}/rest/v1/notices?select=*&limit=1`, {
        method: 'GET',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (probeRes.ok) {
        const data = await probeRes.json();
        console.log("✅ 'notices' table is accessible.");
        if (data.length > 0) {
            console.log("Sample Notice Data:", data[0]);
            console.log("Available columns:", Object.keys(data[0]).join(', '));
        } else {
            console.log("Table is empty, cannot infer columns from GET. Trying minimal POST...");
        }
    } else {
        console.error("❌ Failed to access 'notices' table:", await probeRes.text());
    }

    // 2. Try a Minimal POST to see what works
    const minimalNotice = {
        title: "MINIMAL_TEST_" + Date.now(),
        content: "Testing minimal insert"
    };

    console.log("Attempting minimal insert into 'notices'...");
    const postRes = await fetch(`${supabaseUrl}/rest/v1/notices`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(minimalNotice)
    });

    if (postRes.ok) {
        const inserted = await postRes.json();
        console.log("✨ Minimal POST success!", inserted[0]);
    } else {
        console.error("❌ Minimal POST failed:", await postRes.text());
    }
}

verify();
