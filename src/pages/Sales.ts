import { expect, Page } from "@playwright/test";
import tData from "../data/new-lead.json";
import tDataConvert from "../data/convert-lead.json";
import { FormUtils } from "../utils/FormUtiles";
import { TIMEOUT } from "dns";

export default class Sales {
    private form: FormUtils;

    constructor(private page: Page) {
        this.form = new FormUtils(page);
    }

    async selectLead() {
        try {
            if (tDataConvert.Name && tDataConvert.Name !== "") {
                const leadLocator = this.page.getByRole('link', { name: tDataConvert.Name });
                await this.page.waitForTimeout(1000);
                await leadLocator.click({timeout: 2000});
                console.log(`Selected lead with name: ${tDataConvert.Name}`);
            } else {
                await this.page.locator('tbody tr th').locator('a').first().click();
                console.log('Selected the first lead in the table.');
            }
        } catch (error) {
            console.error('Failed to select lead:', error);
        }
    }

    async convertLead() {
        try {
            if (tDataConvert.ConvertStatus == 'Converted') {
                await this.page.getByRole('option', { name: tDataConvert.ConvertStatus, exact: true }).click();
                await this.page.waitForTimeout(1000);
                await this.page.getByText('Select Converted Status', { exact: true }).click();
                await this.page.waitForTimeout(1000);
                await this.page.getByRole('button', { name: 'Account', exact: true }).click();
                await this.page.waitForTimeout(1000);
                await this.page.getByRole('button', { name: 'Convert', exact: true }).click();
                const errorMessage = await this.page.getByRole('group', { name: 'Account' }).getByRole('alert').isVisible({timeout:3000});
                
                //getByRole('alert');
                if (!errorMessage) {
                    await this.page.getByRole('button', { name: 'Convert', exact: true }).click();
                    console.log("in error")
                }
                console.log('Convert button clicked for lead conversion.');
            } else {
                await this.page.getByRole('option', { name: tDataConvert.ConvertStatus , exact: true }).click();
                await this.page.getByText('Mark as Current Status', { exact: true }).click();
                console.log(`Lead marked as current status: ${tDataConvert.ConvertStatus}`);
            }
        } catch (error) {
            console.error('Failed to convert lead:', error);
        }
    }

    async verifyLeadConverted() {
        try {
            if (tDataConvert.ConvertStatus == 'Converted') {
                const Convertedmessage = await this.page.locator("//div[@class = 'header']//h2").textContent();
                const products = this.page.locator("//div[@class='containerBody']//h3");
                await products.first().waitFor({ state: 'visible' });
                const converted = await products.allTextContents();
                console.log(`${Convertedmessage} into ${converted[0]}, ${converted[1]}, ${converted[2]}.`);
            } else {
                const message = this.page.locator(".slds-theme--success");
                await message.waitFor({ state: 'visible' });
                const toastMessage = await  message.textContent();
                console.log(`${toastMessage}. Lead is marked as ${tDataConvert.ConvertStatus}`);
            }
        } catch (error) {
            console.error('Failed to verify lead conversion:', error);
        }
    }

    async getToastMessage() {
        try {
            const toast = this.page.locator('.toastMessage');
            await toast.waitFor({ state: 'visible', timeout: 5000 });
            const message = await toast.textContent();
            console.log(`Toast message: ${message}`);
        } catch (error) {
            console.error('Failed to get toast message:', error);
        }
    }

    async clickButton(action: string) {
        try {
            await this.form.clickButton(action);
            console.log(`Clicked button: ${action}`);
        } catch (error) {
            console.error(`Failed to click button: ${action}`, error);
        }
    }

    async fillLeadForm() {
        try {
            const newLead = this.page.locator("//div[@class='record-layout-container']");
            await newLead.waitFor({ state: 'visible' });

            //Lead information
            await this.form.selectValueFromDropdown('Salutation', tData.Lead_Information.Salutation, newLead); //Salutation
            await this.form.fillTextByLabel('First Name', tData.Lead_Information.FirstName, newLead); //First_Name
            await this.form.fillTextByLabel('*Last Name', tData.Lead_Information.LastName, newLead); //Last_Name
            await this.form.fillTextByLabel('*Company', tData.Lead_Information.Company, newLead); //Company
            await this.form.fillTextByLabel('Title', tData.Lead_Information.Title, newLead); //Title
            await this.form.selectValueFromDropdown('Lead Source', tData.Lead_Information.LeadSource, newLead); //Lead source
            await this.form.selectValueFromDropdown('Industry', tData.Lead_Information.Industry, newLead); //Industry
            await this.form.selectValueFromDropdown('Rating', tData.Lead_Information.Rating, newLead); //Rating
            await this.form.fillTextByLabel('Annual Revenue', tData.Lead_Information.AnnualRevenue, newLead);
            await this.form.fillTextByLabel('Phone', tData.Lead_Information.Phone, newLead);//Phone
            await this.form.fillTextByLabel('Mobile', tData.Lead_Information.Mobile, newLead);//MobilePhone
            await this.form.fillTextByLabel('Fax', tData.Lead_Information.Fax, newLead);//Fax
            await this.form.fillTextByLabel('Email', tData.Lead_Information.Email, newLead);//Email
            await this.form.fillTextByLabel('Website', tData.Lead_Information.Website, newLead);//Website
            await this.form.selectValueFromDropdown('Lead Status', tData.Lead_Information.LeadStatus, newLead); //Lead Status
            await this.form.fillTextByLabel('No. of Employees', tData.Lead_Information.NumberOfEmployees, newLead);//NumberOfEmployees            
            //Address Information
            await this.form.fillTextByLabel('Street', tData.Address_Information.street, newLead);//street
            await this.form.fillTextByLabel('City', tData.Address_Information.city, newLead);//city
            await this.form.fillTextByLabel('Zip/Postal Code', tData.Address_Information.zipCode, newLead);//zip_Code
            await this.form.fillTextByLabel('State/Province', tData.Address_Information.state, newLead);//state
            await this.form.fillTextByLabel('Country', tData.Address_Information.country, newLead);//country

            //Additional information
            await this.form.selectValueFromDropdown('Product Interest', tData.Additional_Information.ProductInterest, newLead); //Product Interest
            await this.form.fillTextByLabel('Current Generator(s)', tData.Additional_Information.CurrentGenerators, newLead); //CurrentGenerators__c
            await this.form.fillTextByLabel('SIC Code', tData.Additional_Information.SICCode, newLead); //SICCode__c
            await this.form.selectValueFromDropdown('Primary', tData.Additional_Information.Primary, newLead); //Primary
            await this.form.fillTextByLabel('Number of Locations', tData.Additional_Information.NumberofLocations, newLead); //NumberofLocations__c

            //Description
            await this.form.fillTextByLabel('Description', tData.Description, newLead);


            
        } catch (error) {
            console.error('Failed to fill new lead form:', error);
        }

    }

    async verifyLeadCreated() {
        try {
            //const successMessage = this.getToastMessage();
            //console.log(await successMessage);
            const leadName = await this.page.locator("lightning-formatted-name[slot='primaryField']").textContent();
            if (!leadName) {
                throw new Error('Lead was not created successfully');
            }
            console.log('Lead created successfully.');
        } catch (error) {
            console.error('Failed to verify lead creation:', error);
        }
    }

    async navigateToTab(tabName: string) {
        try {
            const tab = this.page.getByRole('link', { name: tabName });
            if (await tab.isVisible() == true) {
                await tab.click();
                console.log(`Navigated to tab: ${tabName}`);
            } else {
                console.error(`Tab "${tabName}" is not visible.`);
                throw new Error(`Tab "${tabName}" is not visible.`);
            }
        } catch (error) {
            console.error(`Failed to navigate to tab: ${tabName}`, error);
        }
    }


}
