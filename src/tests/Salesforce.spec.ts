import { test, expect } from '@playwright/test';
import SFLoginpage from '../pages/SFLoginpage';
import SFHomepage from '../pages/SFHomepage';

test.beforeEach('Salesforce Login', async ({ page }) => {
  // Navigate to the Salesforce login page and log in
  const sfLogin = new SFLoginpage(page);
  await sfLogin.navigatetoLoginPage();
  // Fill in the login form and submit
  await sfLogin.sfLogin('sssvel@cognizant.com', 'Cognizant@2023'); 
     
});

test('App Navigation', async ({ page }) => {
  // Verify that the user is logged in by checking the presence of the Home tab
  const homepage = new SFHomepage(page);
  await homepage.isLoggedIn();
  // Navigate to different apps
  await homepage.navigateToApp('Sales');
  //await homepage.navigateToApp('Service');
  //await homepage.navigateToApp('Marketing');


  
}) 
