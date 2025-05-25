import { Page, expect } from '@playwright/test';
import { time } from 'console';

export default class SFHomepage {

    constructor(private page: Page) {}

    async isLoggedIn() {
        //Verify if the user is logged in by checking the presence of the Home tab
        const inHomePage = await this.page.getByRole('tab').first().textContent();
        expect(inHomePage).toBe('Home');
    } 

    async navigateToApp(appName: string) {
        //user app launcher to search and navigate to the app
        await this.page.getByRole('button', { name: 'App Launcher' }).click();
        await this.page.getByPlaceholder('Search apps and items...').fill(appName);
        await this.page.getByRole('option', { name: appName, exact: true}).click();

        // Wait for the app to load
        await this.page.waitForTimeout(5000); // Adjust the timeout as needed
        const inApp = await this.page.locator('h1 span').first().textContent({timeout : 10000});
        expect(inApp).toBe(appName);
    }

}