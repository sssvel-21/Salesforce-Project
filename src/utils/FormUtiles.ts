import { Locator, Page } from "@playwright/test";

export class FormUtils {
    constructor(private page: Page) { 
        
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