import { test, expect } from '@playwright/test';
import SFLoginpage from '../pages/SFLoginpage';
import SFHomepage from '../pages/SFHomepage';
import Sales from '../pages/Sales';

test.beforeEach('Salesforce Login', async ({ page }) => {
  const loginpage = new SFLoginpage(page);
  await loginpage.navigatetoLoginPage();
  await loginpage.sfLogin(process.env.userId!, process.env.password!);
});

test.skip('Logout', async ({ page }) => {
  const homepage = new SFHomepage(page);
  await homepage.closeBrowser(); 
});

test('Sales | New Lead', async ({ page }) => {
  const homepage = new SFHomepage(page);
  const sales = new Sales(page);

  await test.step('Verify user is on Home Page', async () => {
    await homepage.isLoggedIn();
  });

  await test.step('Navigate to Sales App', async () => {
    await homepage.navigateToApp('Sales');
    await homepage.verifyUserinApp('Sales');
  });

  await test.step('Navigate to Leads tab', async () => {
    await sales.navigateToTab('Leads');
  });

  await test.step('Create a New Lead' , async () => {
    await sales.clickButton('New');
    await sales.fillLeadForm();
    await sales.clickButton('Save');
  });

  await test.step('Verify New Lead is created', async () => {
    await sales.getToastMessage();
    await sales.verifyLeadCreated();
  });
});

test('Sales | Lead Conversion', async ({ page }) => {
  const homepage = new SFHomepage(page);
  const sales = new Sales(page);
  await test.step('Verify user is on Home Page', async () => {
    await homepage.isLoggedIn();
  });

  await test.step('Navigate to Sales App', async () => {
    await homepage.navigateToApp('Sales');
    await homepage.verifyUserinApp('Sales');
  });

  await test.step('Navigate to Leads tab', async () => {
    await sales.navigateToTab('Leads');
  });

  await test.step('Select a Lead', async () => {
    await sales.selectLead();
  });

  await test.step('Convert Lead', async () => {
    await sales.convertLead();
  });
  await test.step('Verify Lead Conversion', async () => {
    await sales.verifyLeadConverted();
  });

})