const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Finalizing Parent Link and Results...");
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

            const parentId = "fcd13cd5-192b-4111-b660-684572d380f0";
            
            // 1. Create Profile if missing
            const profiles = await db('profiles', 'GET', null, `?id=eq.${parentId}`);
            if (profiles.length === 0) {
                await db('profiles', 'POST', {
                    id: parentId,
                    full_name: 'Parent 123',
                    role: 'parent'
                });
                console.log("Profile created for Parent 123");
            }

            // 2. Find a 7th Grade Student
            const students = await db('students', 'GET', null, '?select=*,sections:section_id(name,classes(name))');
            const student7th = students.find(s => s.sections?.classes?.name === '7th');
            
            if (!student7th) return { success: false, error: "No 7th grade student found" };

            // 3. Link Student to Parent
            await db('students', 'PATCH', { parent_id: parentId }, `?id=eq.${student7th.id}`);

            // 4. Get 7th Grade Subjects
            const subjects = await db('subjects', 'GET', null, `?class=eq.7th`);
            
            if (subjects.length === 0) return { success: false, error: "No subjects found for 7th grade" };

            // 5. Delete existing results for this student to ensure "the one we submitted" is visible
            await db('results', 'DELETE', null, `?student_id=eq.${student7th.id}`);

            // 6. Seed Results
            const marksData = subjects.map(sub => ({
                student_id: student7th.id,
                subject_id: sub.id,
                marks_obtained: Math.floor(Math.random() * 20) + 80, // 80-100
                total_marks: 100,
                exam_name: 'Final Term 2024',
                recorded_at: new Date().toISOString()
            }));

            await db('results', 'POST', marksData);

            return { 
                success: true, 
                student: student7th.admission_no, 
                parent: 'Parent 123',
                results_count: marksData.length,
                subjects: subjects.map(s => s.name)
            };
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
