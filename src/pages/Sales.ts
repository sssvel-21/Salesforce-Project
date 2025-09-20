import { expect, Locator, Page } from "@playwright/test";
import new_lead from "../data/new-lead.json";
import convert_lead from "../data/convert-lead.json";
import new_opportunity from "../data/new-opportunity.json";
import { FormUtils } from "../utils/FormUtiles";

export default class Sales {
    private form: FormUtils;

    constructor(private page: Page) {
        this.form = new FormUtils(page);
        
    }
    

    async selectLead() {
        try {
            if (convert_lead.Name && convert_lead.Name !== "") {
                const leadLocator : Locator = this.page.getByRole('link', { name: convert_lead.Name });
                await this.page.waitForTimeout(1000);
                await leadLocator.click({timeout: 2000});
                console.log(`Selected lead with name: ${convert_lead.Name}`);
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
            if (convert_lead.ConvertStatus == 'Converted') {
                await this.page.getByRole('option', { name: convert_lead.ConvertStatus, exact: true }).click();
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
                await this.page.getByRole('option', { name: convert_lead.ConvertStatus , exact: true }).click();
                await this.page.getByText('Mark as Current Status', { exact: true }).click();
                console.log(`Lead marked as current status: ${convert_lead.ConvertStatus}`);
            }
        } catch (error) {
            console.error('Failed to convert lead:', error);
        }
    }

    async verifyLeadConverted() {
        try {
            if (convert_lead.ConvertStatus == 'Converted') {
                const Convertedmessage = await this.page.locator("//div[@class = 'header']//h2").textContent();
                const products = this.page.locator("//div[@class='containerBody']//h3");
                await products.first().waitFor({ state: 'visible' });
                const converted = await products.allTextContents();
                console.log(`${Convertedmessage} into ${converted[0]}, ${converted[1]}, ${converted[2]}.`);
            } else {
                const message = this.page.locator(".slds-theme--success");
                await message.waitFor({ state: 'visible' });
                const toastMessage = await  message.textContent();
                console.log(`Lead is marked as ${convert_lead.ConvertStatus}`);
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
            const newForm = this.page.locator("//div[@class='record-layout-container']");
            await newForm.waitFor({ state: 'visible' });

            //Lead information
            await this.form.selectValueFromDropdown('Salutation', new_lead.Lead_Information.Salutation, newForm); //Salutation
            await this.form.fillTextByLabel('First Name', new_lead.Lead_Information.FirstName, newForm); //First_Name
            await this.form.fillTextByLabel('*Last Name', new_lead.Lead_Information.LastName, newForm); //Last_Name
            await this.form.fillTextByLabel('*Company', new_lead.Lead_Information.Company, newForm); //Company
            await this.form.fillTextByLabel('Title', new_lead.Lead_Information.Title, newForm); //Title
            await this.form.selectValueFromDropdown('Lead Source', new_lead.Lead_Information.LeadSource, newForm); //Lead source
            await this.form.selectValueFromDropdown('Industry', new_lead.Lead_Information.Industry, newForm); //Industry
            await this.form.selectValueFromDropdown('Rating', new_lead.Lead_Information.Rating, newForm); //Rating
            await this.form.fillTextByLabel('Annual Revenue', new_lead.Lead_Information.AnnualRevenue, newForm);
            await this.form.fillTextByLabel('Phone', new_lead.Lead_Information.Phone, newForm);//Phone
            await this.form.fillTextByLabel('Mobile', new_lead.Lead_Information.Mobile, newForm);//MobilePhone
            await this.form.fillTextByLabel('Fax', new_lead.Lead_Information.Fax, newForm);//Fax
            await this.form.fillTextByLabel('Email', new_lead.Lead_Information.Email, newForm);//Email
            await this.form.fillTextByLabel('Website', new_lead.Lead_Information.Website, newForm);//Website
            await this.form.selectValueFromDropdown('Lead Status', new_lead.Lead_Information.LeadStatus, newForm); //Lead Status
            await this.form.fillTextByLabel('No. of Employees', new_lead.Lead_Information.NumberOfEmployees, newForm);//NumberOfEmployees            
            //Address Information
            await this.form.fillTextByLabel('Street', new_lead.Address_Information.street, newForm);//street
            await this.form.fillTextByLabel('City', new_lead.Address_Information.city, newForm);//city
            await this.form.fillTextByLabel('Zip/Postal Code', new_lead.Address_Information.zipCode, newForm);//zip_Code
            await this.form.fillTextByLabel('State/Province', new_lead.Address_Information.state, newForm);//state
            await this.form.fillTextByLabel('Country', new_lead.Address_Information.country, newForm);//country

            //Additional information
            await this.form.selectValueFromDropdown('Product Interest', new_lead.Additional_Information.ProductInterest, newForm); //Product Interest
            await this.form.fillTextByLabel('Current Generator(s)', new_lead.Additional_Information.CurrentGenerators, newForm); //CurrentGenerators__c
            await this.form.fillTextByLabel('SIC Code', new_lead.Additional_Information.SICCode, newForm); //SICCode__c
            await this.form.selectValueFromDropdown('Primary', new_lead.Additional_Information.Primary, newForm); //Primary
            await this.form.fillTextByLabel('Number of Locations', new_lead.Additional_Information.NumberofLocations, newForm); //NumberofLocations__c

            //Description
            await this.form.fillTextByLabel('Description', new_lead.Description, newForm);
        
            console.log(`lead form has been successfully filled out.`);
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
            console.log(`Lead created successfully, Lead Name: ${leadName}`);
        } catch (error) {
            console.error('Failed to verify opportunity creation:', error);
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

    async fillOpportunityForm() {
        try {
            const newForm = this.page.locator("//div[@class='record-layout-container']");
            await newForm.waitFor({ state: 'visible' });

            //Opportunity Information
            await this.form.selectcheckBox('Private', new_opportunity.Opportunity_Information.Private, newForm);
            await this.form.fillTextByLabel('*Opportunity Name', new_opportunity.Opportunity_Information.Name, newForm);
            await this.form.selectFromLookUp('Account Name',new_opportunity.Opportunity_Information.Account, 0, newForm)
            await this.form.selectValueFromDropdown('Type', new_opportunity.Opportunity_Information.Type, newForm); 
            await this.form.selectValueFromDropdown('Lead Source', new_opportunity.Opportunity_Information.LeadSource, newForm);
            await this.form.fillTextByLabel('Amount', new_opportunity.Opportunity_Information.Amount, newForm);
            await this.form.fillTextByLabel('*Close Date', new_opportunity.Opportunity_Information.CloseDate, newForm);
            await this.form.fillTextByLabel('Next Step', new_opportunity.Opportunity_Information.NextStep, newForm );
            await this.form.fillTextByLabel('Probability (%)', new_opportunity.Opportunity_Information.Probability, newForm );
            await this.form.selectValueFromDropdown('Stage', new_opportunity.Opportunity_Information.StageName, newForm);
            await this.form.selectFromLookUp('Primary Campaign Source',new_opportunity.Opportunity_Information.CampaignId, 1, newForm)

            //Additional Information
            await this.form.fillTextByLabel('Order Number', new_opportunity.Additional_Information.OrderNumber__c, newForm);
            await this.form.fillTextByLabel('Main Competitor(s)', new_opportunity.Additional_Information.MainCompetitors__c, newForm);
            await this.form.fillTextByLabel('Current Generator(s)', new_opportunity.Additional_Information.CurrentGenerators__c, newForm);
            await this.form.selectValueFromDropdown('Delivery/Installation Status', new_opportunity.Additional_Information.DeliveryInstallationStatus__c, newForm);
            await this.form.fillTextByLabel('Tracking Number', new_opportunity.Additional_Information.TrackingNumber__c, newForm);

            //description
            await this.form.fillTextByLabel('Description', new_opportunity.Description, newForm);

            console.log(`Opportunity form has been successfully filled out.`);
        } catch (error) {
            console.error('Failed to fill opportunity form:', error);
        }
    }

    async verifyOpportunityCreated() {
        try {
            //const successMessage = this.getToastMessage();
            //console.log(await successMessage);
            const optyName = await this.page.locator("lightning-formatted-text[slot='primaryField']").textContent();
            if (!optyName) {
                throw new Error('Opportunity was not created successfully');
            }
            console.log(`Opportunity created successfully, Opportunity Name: ${optyName}`);
        } catch (error) {
            console.error('Failed to verify opportunity creation:', error);
        }
        
    }

}
