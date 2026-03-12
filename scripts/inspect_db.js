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
                const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
                    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Prefer': 'count=exact' }
                });
                return res.headers.get('content-range');
            }

            async function getOne(table) {
                const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
                    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
                });
                return await res.json();
            }

            return {
                studentsCount: await getCount('students'),
                feesCount: await getCount('fees_payments'),
                studentSample: await getOne('students'),
                feeSample: await getOne('fees_payments')
            };
        });
        
        console.log("Database Status Snapshot:");
        console.log(JSON.stringify(info, null, 2));
    } catch (err) {
        console.error("Error inspecting database:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
