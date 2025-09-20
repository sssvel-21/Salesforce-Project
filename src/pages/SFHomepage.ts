import { Locator, Page, expect } from '@playwright/test';
import test from '@playwright/test';
import { time } from 'console';

export default class SFHomepage {

    constructor(private page: Page) { }

    async isLoggedIn() {
        const homeTab = this.page.getByRole('tab', { name: 'Home', exact: true });
        // Wait for the Home tab to be visible, indicating the user is logged in
        await homeTab.waitFor({ state: 'visible', timeout: 15000 });
        const inHomePage = await homeTab.textContent();
        if (inHomePage?.trim() !== 'Home') {
            throw new Error(`Expected tab text 'Home', but got '${inHomePage?.trim()}'`);
        }
        expect(inHomePage?.trim()).toBe('Home');
        console.log('User is logged in and on the Home tab.');

    }

    async navigateToApp(appName: string) :Promise<void> {
        const appLauncher =  this.page.getByRole('button', { name: 'App Launcher' });
        try {
            if (!(await appLauncher.isVisible())) {
                console.error('App Launcher is not visible. Stopping the test.');
            } else {
                await appLauncher.click();
                await this.page.getByRole('combobox', { name: 'Search apps and items...' }).click();
                await this.page.getByPlaceholder('Search apps and items...').fill(appName);
                await this.page.getByRole('option', { name: appName, exact: true }).click();
                await this.page.waitForTimeout(5000);
            }
        } catch (error) {
            console.error(`Failed to navigate to app: ${appName}`);
        }
    }

    async verifyUserinApp(appName: string) :Promise<void>{
        try {
            const inApp = await this.page.locator('h1 span').first().textContent({ timeout: 5000 });
            if (inApp?.trim() !== appName) {
                throw new Error(`Expected app name '${appName}', but got '${inApp?.trim()}'`);
            }
            expect(inApp?.trim()).toBe(appName);
            console.log(`User is in the app: ${appName}`);
        } catch (error) {
            console.error(`Failed to verify user in app: ${appName}`, error);
        }
    }

    async closeBrowser() {
        await this.page.close();
        console.log('Browser closed successfully.');
    }


}