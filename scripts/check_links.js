const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Checking Parent-Student Linking...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            async function db(table, query = '*') {
                const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${query}`, {
                    headers: {
                        'apikey': serviceRoleKey,
                        'Authorization': `Bearer ${serviceRoleKey}`
                    }
                });
                return await res.json();
            }

            const profiles = await db('profiles');
            const parents = profiles.filter(p => p.role === 'parent');
            
            const students = await db('students', '*,sections(name,classes(name))');
            
            const results = await db('results');

            return { parents, students: students.slice(0, 10), results_count: results.length, sample_results: results.slice(0, 5) };
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Diagnostic Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
