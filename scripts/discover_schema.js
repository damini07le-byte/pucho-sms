const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Triggering Error for Schema Discovery...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            const res = await fetch(`${supabaseUrl}/rest/v1/results`, {
                method: 'POST',
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ dummy_column: 'test' })
            });
            const error = await res.json();
            return error;
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
