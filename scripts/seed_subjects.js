
const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDMzMzIsImV4cCI6MjA4MTYxOTMzMn0.LlYAFQfEDZ8ObeK_voI4KLb3OPzLg002Lx28DBNkN3w';

const subjects = [
    "English Core", "Physics", "Chemistry", "Mathematics", "Biology",
    "Accountancy", "Business Studies", "Economics", "History",
    "Geography", "Political Science", "Computer Science", "Physical Education"
];

const targetClass = "11th";

async function seedSubjects() {
    console.log(`Seeding subjects for ${targetClass}...`);

    for (const name of subjects) {
        const subject = {
            id: crypto.randomUUID(),
            name: name,
            class: targetClass
        };

        const response = await fetch(`${supabaseUrl}/rest/v1/subjects`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(subject)
        });

        if (response.ok) {
            console.log(`Added: ${name}`);
        } else {
            console.error(`Failed to add: ${name}`, await response.text());
        }
    }
    console.log("Seeding complete!");
}

seedSubjects();
