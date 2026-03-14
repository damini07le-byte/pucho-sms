const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Finding test_parent_123 ID...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`
                }
            });
            
            const { users } = await response.json();
            const user = users.find(u => u.email === 'test_parent_123@pucho.ai');
            return user ? { id: user.id, email: user.email } : { error: "Not found" };
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
