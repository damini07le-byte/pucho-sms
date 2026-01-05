/**
 * SUPABASE BATCH UPDATE SCRIPT
 * Run this in your browser console on the dashboard page to update existing staff records
 * with a default qualification if they are missing it.
 */

async function updateStaffQualifications() {
    console.log("🚀 Starting Qualification Update...");

    // 1. Get all staff members
    const staff = schoolDB.staff;

    if (!staff || staff.length === 0) {
        console.log("❌ No staff members found in schoolDB.");
        return;
    }

    let updatedCount = 0;

    for (const member of staff) {
        // Only update if qualification is missing or 'undefined' string
        if (!member.qualification || member.qualification === 'undefined' || member.qualification === 'N/A') {
            const defaultQual = member.role === 'Teacher' ? 'B.Ed, Graduation' : 'Certification';

            console.log(`Updating ${member.name} (${member.id}) with: ${defaultQual}`);

            try {
                // Call the existing DB helper
                const result = await dashboard.db('staff', 'PATCH',
                    { qualification: defaultQual },
                    `?id=eq.${member.id}`
                );

                if (result) {
                    member.qualification = defaultQual;
                    updatedCount++;
                }
            } catch (err) {
                console.error(`Error updating ${member.name}:`, err);
            }
        }
    }

    console.log(`✅ Update Complete! ${updatedCount} records were synced.`);
    showToast(`${updatedCount} Staff members updated.`, 'success');
    dashboard.loadPage('staff'); // Refresh the view
}

// Execute
updateStaffQualifications();
