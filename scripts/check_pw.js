const { chromium } = require('@playwright/test');
(async () => {
    try {
        const browser = await chromium.launch();
        console.log("SUCCESS: Browser launched");
        await browser.close();
    } catch (e) {
        console.error("FAILURE:", e);
    }
})();
