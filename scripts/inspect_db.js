const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const info = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            async function getCount(table) {
                try {
                    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
                        headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Prefer': 'count=exact' }
                    });
                    if (!res.ok) return "ERROR: " + await res.text();
                    return res.headers.get('content-range');
                } catch (e) { return "FETCH_ERROR: " + e.message; }
            }

            async function getOne(table) {
                try {
                    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
                        headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
                    });
                    if (!res.ok) return { error: await res.text() };
                    return await res.json();
                } catch (e) { return { error: e.message }; }
            }

            return {
                profiles: {
                    count: await getCount('profiles'),
                    sample: await getOne('profiles')
                }
            };
        });
        
        console.log("Profiles Table Status:");
        console.log(JSON.stringify(info, null, 2));
    } catch (err) {
        console.error("Critical Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
