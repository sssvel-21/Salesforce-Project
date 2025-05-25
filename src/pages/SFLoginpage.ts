import { Page } from '@playwright/test';
import SFHomepage from './SFHomepage';

export default class SFLoginpage {

    private readonly usernameInput = '#username';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#Login';

    constructor(private page: Page) {}

    async navigatetoLoginPage() {
        // Navigate to the Salesforce login page
        await this.page.goto('/');
    }
    
    async sfLogin(username: string, password: string) {
        // Fill in the login form and submit
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        // Wait for the login button to be visible and then click it
        await this.page.click(this.loginButton, {timeout: 10000});
        //const homepage = new SFHomepage(this.page);
        //return homepage;
        
    }    
}