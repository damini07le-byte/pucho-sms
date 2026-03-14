const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Final Robust Result Seeding...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            
            async function db(table, method = 'GET', body = null, query = '') {
                const res = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
                    method: method,
                    headers: {
                        'apikey': serviceRoleKey,
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: body ? JSON.stringify(body) : null
                });
                return await res.json();
            }

            // 1. Parent 123 ID
            const parentId = "fcd13cd5-192b-4111-b660-684572d380f0";

            // 2. Find a 7th Grade Student
            const allStudents = await db('students', 'GET', null, '?select=*,sections:section_id(name,classes(name))');
            const student7th = allStudents.find(s => s.sections?.classes?.name === '7th');
            if (!student7th) return { success: false, error: "No 7th grade student found" };

            // 3. Update guardian_name to "Vikram Das" AND link parent_id to test_parent_123
            await db('students', 'PATCH', { 
                guardian_name: 'Vikram Das',
                parent_id: parentId
            }, `?id=eq.${student7th.id}`);

            // 4. Get 7th Grade Subjects
            const subjects = await db('subjects', 'GET', null, '?class=eq.7th');
            if (subjects.length === 0) return { success: false, error: "No subjects found for 7th" };

            // 5. Clean up old results for this student
            await db('results', 'DELETE', null, `?student_id=eq.${student7th.id}`);

            // 6. Seed Results
            const marksData = subjects.slice(0, 10).map(sub => {
                const marks = Math.floor(Math.random() * 20) + 80;
                let grade = 'A';
                if (marks >= 90) grade = 'A+';
                return {
                    student_id: student7th.id,
                    subject_id: sub.id,
                    marks_obtained: marks,
                    total_marks: 100,
                    grade: grade
                };
            });

            const inserted = await db('results', 'POST', marksData);

            return { 
                success: true, 
                student: student7th.admission_no, 
                guardian: 'Vikram Das',
                parent_linked: true,
                results_count: inserted.length
            };
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
