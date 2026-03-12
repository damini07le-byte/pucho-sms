const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("🚀 Launching Seeding Engine (Playwright)...");
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
                if (!res.ok) throw new Error("API Error: " + await res.text());
                return await res.json();
            }

            async function authApi(path, method = 'POST', body = null) {
                const url = `${supabaseUrl}/auth/v1/admin/${path}`;
                const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
                const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
                if (!res.ok) throw new Error("Auth Admin Error: " + await res.text());
                return await res.json();
            }

            const results = [];
            const existingClasses = await api('classes?select=id,name');
            const classMap = {}; existingClasses.forEach(c => classMap[c.name] = c.id);
            for (const className of CLASSES) { if (!classMap[className]) { const created = await api('classes', 'POST', { name: className }); classMap[className] = created[0].id; } }
            
            const existingSections = await api('sections?select=id,name,class_id');
            const sectionMap = {}; existingSections.forEach(s => { const clsName = Object.keys(classMap).find(name => classMap[name] === s.class_id); if (clsName) sectionMap[clsName + "-" + s.name] = s.id; });
            for (const className of CLASSES) { for (const sectionName of SECTIONS) { const key = className + "-" + sectionName; if (!sectionMap[key]) { const created = await api('sections', 'POST', { name: sectionName, class_id: classMap[className] }); sectionMap[key] = created[0].id; } } }
            
            const names = ['Aryan Sharma', 'Zia Khan', 'Ishaan Verma', 'Ananya Gupta', 'Rohan Das', 'Sana Parveen', 'Kabir Singh', 'Meera Iyer', 'Arjun Reddy', 'Kyra Malhotra', 'Vihaan Shah', 'Sara Ali', 'Reyansh Pant', 'Ivaan Jain', 'Aarav Kumar'];
            
            for (const className of CLASSES) {
                for (const sectionName of SECTIONS) {
                    const sectionId = sectionMap[className + "-" + sectionName];
                    const studentsInSec = await api("students?section_id=eq." + sectionId + "&select=id", 'GET');
                    const count = studentsInSec.length;

                    if (count < STUDENTS_PER_SECTION) {
                        for (let i = 0; i < (STUDENTS_PER_SECTION - count); i++) {
                            const rollNo = count + i + 1;
                            const studentName = names[Math.floor(Math.random() * names.length)];
                            const email = "std_" + className.toLowerCase().replace(/[^a-z0-9]/g, '') + "_" + sectionName.toLowerCase() + "_" + rollNo + "_" + Math.random().toString(36).substring(7) + "@pucho.ai";
                            
                            try {
                                const userRes = await authApi('users', 'POST', { email, password: 'Password123!', email_confirm: true, user_metadata: { role: 'student' } });
                                const userUuid = userRes.id;
                                await api('profiles', 'POST', { id: userUuid, full_name: studentName, role: 'student', phone: '9876543210' });
                                await api('students', 'POST', { id: userUuid, section_id: sectionId, admission_no: "ADM-" + className.substring(0,2).toUpperCase() + "-" + sectionName + "-" + rollNo + "-" + Math.random().toString(36).substring(2,5), roll_no: rollNo, status: 'Active', gender: i % 2 === 0 ? 'Male' : 'Female', dob: '2015-05-15' });
                                const isPaid = (sectionName === 'A' && rollNo <= 3) || (sectionName === 'B' && rollNo <= 2);
                                if (isPaid) {
                                    await api('fees_payments', 'POST', { id: "FEE-" + userUuid.substring(0,8), student_id: userUuid, amount: 5000, status: 'Paid', paid_date: new Date().toISOString() });
                                }
                                results.push(`Created: ${studentName} (${className}-${sectionName})`);
                            } catch (e) {
                                results.push(`Error creating student: ${e.message}`);
                            }
                        }
                    }
                }
            }
            return results;
        });
        
        console.log("Seeding Report:");
        result.forEach(r => console.log(" - " + r));
        console.log("✅ Seeding Process Finished.");
    } catch (err) {
        console.error("Critical Seeding Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
