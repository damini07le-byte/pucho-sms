const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

async function inspectData() {
    console.log("🔍 Looking for ANY Section 'B' linked to ANY Class named '7th'...");

    // 1. Get all classes named '7th'
    const clsRes = await fetch(`${supabaseUrl}/rest/v1/classes?name=eq.7th&select=id,name`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const classes = await clsRes.json();
    const classIds = classes.map(c => c.id);
    console.log(`Found ${classIds.length} classes named '7th'.`);

    // 2. Get all sections named 'B' for these classes
    const secRes = await fetch(`${supabaseUrl}/rest/v1/sections?name=eq.B&class_id=in.(${classIds.join(',')})&select=id,name,class_id`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const sections = await secRes.json();
    console.log(`Found ${sections.length} sections named 'B' linked to '7th' classes:`, sections);

    for (const sec of sections) {
        const stuRes = await fetch(`${supabaseUrl}/rest/v1/students?section_id=eq.${sec.id}&select=id`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const students = await stuRes.json();
        console.log(`Section ID ${sec.id} (Name: ${sec.name}) has ${students.length} students.`);
    }
}

inspectData();
