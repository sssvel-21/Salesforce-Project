import { Locator, Page } from "@playwright/test";

export class FormUtils {
    constructor(private page: Page) { 
        
    }

    async selectcheckBox(fieldName: string, value: boolean,  parent: Locator){
        const parentLocator = parent || this.page;
        if(value == true){
            await parentLocator.getByRole('checkbox', { name: fieldName}).check();
        }else if(value == false || value == null){
            await parentLocator.getByRole('checkbox', { name: fieldName}).uncheck();
    }
}

    async selectFromLookUp(fieldName: string, value: string, n: number , parent: Locator){
        const parentLocator = parent || this.page;
        await parentLocator.getByLabel(fieldName,{ exact: true } ).fill(value);
        await parentLocator.getByLabel(fieldName,{ exact: true } ).press('Enter');
        await this.page.waitForTimeout(1000);
         await this.page.locator("//lightning-base-combobox-item[@data-value='actionAdvancedSearch']").nth(n).click();
        await this.page.getByRole('gridcell', { name: 'Select Item 1' }).locator('span').nth(1).click();
        await this.page.getByRole('button', { name: 'Select' }).click();
    }

    async fillTextByLabel(fieldName: string, value: string,  parent: Locator) {
        const parentLocator = parent || this.page;
        await parentLocator.getByLabel(fieldName, { exact: true }).fill(value);
    }

    async fillTextByRole(fieldName: string, value: string,  parent: Locator) {
        const parentLocator = parent || this.page;
        await parentLocator.getByRole('textbox', { name: fieldName }).fill(value);
    }

    async selectValueFromDropdown(dropdownName: string, value: string, parent: Locator) {
        const parentLocator = parent || this.page;
        await parentLocator.getByRole('combobox', { name: dropdownName, exact: true }).click();
        await parentLocator.getByRole('option', { name: value, exact: true }).click();
    }

    async clickButton(action: string) {
        await this.page.getByRole('button', { name: action, exact: true }).click();
    }

    async geterrorMessage(parent: Locator) {
        const parentLocator = parent || this.page;
        const errordialog = await parentLocator.getByRole('heading', { name: 'Similar Records Exist' });
        if (await errordialog.isVisible() === false) {
           return null; // No error dialog found
        }else {
            const errordialogText = await errordialog.textContent();
        return errordialogText ? errordialogText.trim() : null;
    }
    }
}