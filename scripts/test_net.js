const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("🚀 Launching Playwright browser...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        console.log("🌐 Testing connectivity to Supabase...");
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            try {
                const res = await fetch(supabaseUrl + '/rest/v1/classes?select=id&limit=1', {
                    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
                });
                if (res.ok) return "CONNECTED";
                return "AUTH_ERROR: " + await res.text();
            } catch (e) {
                return "FETCH_FAILED: " + e.message;
            }
        });
        
        console.log("Result:", result);
    } catch (err) {
        console.error("Browser Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
