const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("Linking Parent and Seeding Results...");
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

            // 1. Get Parent ID for test_parent_123@pucho.ai
            const profiles = await db('profiles', 'GET', null, '?role=eq.parent');
            const parent = profiles.find(p => p.id === '6a172776-92cb-4652-98e3-0c4a4e101cf1' || p.full_name?.includes('parent_123')); 
            // I'll check the profiles again to be sure of the ID.
            
            // 2. Get a 7th Grade Student
            const students = await db('students', 'GET', null, '?select=*,sections:section_id(name,classes(name))');
            const student7th = students.find(s => s.sections?.classes?.name === '7th');
            
            if (!student7th) return { success: false, error: "No 7th grade student found" };
            
            // Let's find the correct parent ID first
            const targetParent = profiles.find(p => p.full_name?.toLowerCase().includes('parent 123') || p.id === '6a172776-92cb-4652-98e3-0c4a4e101cf1');
            
            if (!targetParent) return { success: false, error: "Target parent not found", profiles };

            // 3. Link Student to Parent
            await db('students', 'PATCH', { parent_id: targetParent.id }, `?id=eq.${student7th.id}`);

            // 4. Get 7th Grade Subjects
            const subjects = await db('subjects', 'GET', null, `?class=eq.7th`);
            
            if (subjects.length === 0) return { success: false, error: "No subjects found for 7th grade" };

            // 5. Seed Results
            const marksData = subjects.map(sub => ({
                student_id: student7th.id,
                subject_id: sub.id,
                marks_obtained: Math.floor(Math.random() * 20) + 80, // 80-100
                total_marks: 100,
                exam_name: 'Final Term 2024',
                recorded_at: new Date().toISOString()
            }));

            const seededResults = await db('results', 'POST', marksData);

            return { 
                success: true, 
                linked_student: student7th.admission_no, 
                parent: targetParent.full_name,
                results_count: marksData.length 
            };
        });
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Seeding Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
