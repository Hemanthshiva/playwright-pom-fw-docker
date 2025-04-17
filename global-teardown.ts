import { chromium } from '@playwright/test';

async function globalTeardown() {
  try {
    // Launch and immediately close to clean up any hanging processes
    const browser = await chromium.launch();
    await browser.close();
    
    // Small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (e) {
    console.error('Error during teardown:', e);
  } finally {
    // Force process exit to clean up any remaining browser processes
    process.exit(0);
  }
}

export default globalTeardown;