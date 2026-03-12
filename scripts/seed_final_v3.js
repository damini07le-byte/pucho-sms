const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("🚀 Launching Final Seeding Engine (V3)...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            const CLASSES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
            const SECTIONS = ['A', 'B'];
            const STUDENTS_PER_SECTION = 5;

            async function api(path, method = 'GET', body = null) {
                const url = `${supabaseUrl}/rest/v1/${path}`;
                const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
                const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
                if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);
                return await res.json();
            }

            async function authApi(path, method = 'POST', body = null) {
                const url = `${supabaseUrl}/auth/v1/admin/${path}`;
                const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
                const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
                if (!res.ok) throw new Error(`Auth Admin Error ${res.status}: ${await res.text()}`);
                return await res.json();
            }

            const results = [];
            
            // 1. CLEANUP: Delete all @pucho.ai students (to start fresh)
            console.log("🧹 Cleaning up old test data...");
            const authUsersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
            });
            const { users } = await authUsersRes.json();
            const toDelete = users.filter(u => u.email && u.email.endsWith('@pucho.ai'));
            
            for (const u of toDelete) {
                await fetch(`${supabaseUrl}/auth/v1/admin/users/${u.id}`, {
                    method: 'DELETE',
                    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
                });
            }
            results.push(`Cleanup: Deleted ${toDelete.length} old student users.`);

            // 2. Ensure Classes & Sections
            const existingClasses = await api('classes?select=id,name');
            const classMap = {}; existingClasses.forEach(c => classMap[c.name] = c.id);
            for (const className of CLASSES) {
                if (!classMap[className]) {
                    const created = await api('classes', 'POST', { name: className });
                    classMap[className] = created[0].id;
                }
            }
            
            const existingSections = await api('sections?select=id,name,class_id');
            const sectionMap = {};
            existingSections.forEach(s => {
                const clsName = Object.keys(classMap).find(name => classMap[name] === s.class_id);
                if (clsName) sectionMap[`${clsName}-${s.name}`] = s.id;
            });
            for (const className of CLASSES) {
                for (const sectionName of SECTIONS) {
                    const key = `${className}-${sectionName}`;
                    if (!sectionMap[key]) {
                        const created = await api('sections', 'POST', { name: sectionName, class_id: classMap[className] });
                        sectionMap[key] = created[0].id;
                    }
                }
            }
            
            // 3. SEEDING
            const names = ['Aryan Sharma', 'Zia Khan', 'Ishaan Verma', 'Ananya Gupta', 'Rohan Das', 'Sana Parveen', 'Kabir Singh', 'Meera Iyer', 'Arjun Reddy', 'Kyra Malhotra', 'Vihaan Shah', 'Sara Ali', 'Reyansh Pant', 'Ivaan Jain', 'Aarav Kumar'];
            
            for (const className of CLASSES) {
                for (const sectionName of SECTIONS) {
                    const sectionId = sectionMap[`${className}-${sectionName}`];
                    // Since we cleaned up, we add exactly STUDENTS_PER_SECTION
                    for (let i = 0; i < STUDENTS_PER_SECTION; i++) {
                        const rollNo = i + 1;
                        const studentName = names[Math.floor(Math.random() * names.length)];
                        const email = `std_${className.toLowerCase().replace(/[^a-z0-9]/g, '')}_${sectionName.toLowerCase()}_${rollNo}_${Math.random().toString(36).substring(7)}@pucho.ai`;
                        
                        try {
                            // Create User
                            const userRes = await authApi('users', 'POST', { email, password: 'Password123!', email_confirm: true, user_metadata: { role: 'student' } });
                            const userUuid = userRes.id;
                            
                            // Create Profile
                            await api('profiles', 'POST', { id: userUuid, full_name: studentName, role: 'student', phone: '9876543210' });
                            
                            // Create Student
                            await api('students', 'POST', {
                                id: userUuid,
                                section_id: sectionId,
                                admission_no: `ADM-${className.substring(0,2).toUpperCase()}-${sectionName}-${rollNo}-${Math.random().toString(36).substring(2,5)}`,
                                roll_no: rollNo,
                                status: 'Active',
                                gender: i % 2 === 0 ? 'Male' : 'Female',
                                dob: '2015-05-15'
                            });

                            // Create Fee Payment (CORRECT SCHEMA)
                            // Screenshot show: id (uuid), student_id, amount_paid, payment_date, payment_method
                            const isPaid = (sectionName === 'A' && rollNo <= 3) || (sectionName === 'B' && rollNo <= 2);
                            if (isPaid) {
                                await api('fees_payments', 'POST', {
                                    id: crypto.randomUUID(),
                                    student_id: userUuid,
                                    amount_paid: 5000,
                                    payment_date: new Date().toISOString(),
                                    payment_method: 'Cash'
                                });
                            }
                            results.push(`Created: ${studentName} (${className}-${sectionName}) + Fee: ${isPaid ? 'PAID' : 'PENDING'}`);
                        } catch (e) {
                            results.push(`Error creating student ${studentName}: ${e.message}`);
                        }
                    }
                }
            }
            return results;
        });
        
        console.log("Seeding Report Snapshot:");
        result.slice(0, 10).forEach(r => console.log(" - " + r));
        console.log(`... and ${result.length - 10} more results.`);
        console.log("✅ Seeding Process Finished.");
    } catch (err) {
        console.error("Critical Seeding Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
