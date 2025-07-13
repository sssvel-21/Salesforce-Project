import { Page } from '@playwright/test';
import SFHomepage from './SFHomepage';
import Sales from './Sales';

export default class SFLoginpage {

    private readonly usernameInput = '#username';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#Login';

    constructor(private page: Page) { }

    /**
     * Logs into Salesforce using the provided username and password.
     * @param username - The Salesforce username.
     * @param password - The Salesforce password.
     * @returns Promise<void>
     */
    async sfLogin(username: string, password: string) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    async navigatetoLoginPage() {
        // Navigate to the Salesforce login page
        await this.page.goto('/');
        console.log('Navigated to Salesforce login page.');
    }
}