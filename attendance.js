const puppeteer = require('puppeteer');  //importing puppeteer library

const username = "<PESU_SRN_goes_here>"; //input your PESU_SRN inside ""
const password = "<password_goes_here>"; //input your PESU_academy_password inside ""

const loginUrl = "https://www.pesuacademy.com/Academy/"; //pesu_academy login_portal link
const profileUrl = "https://www.pesuacademy.com/Academy/s/studentProfilePESU";//profile page after logging in

(async () => {
  const browser = await puppeteer.launch({ headless: false });//open a browser instance
  //remove {headless: false} if you don't want to view the whole process in browser
  const page = await browser.newPage();//new page 
  await page.goto(loginUrl);//navigate to login portal
  //login form has structure of : username and password(textbox) and a submit button
  await page.type('input[name="j_username"]', username);//inspect the page to view the structure
  await page.type('input[name="j_password"]', password);

  const elementHandle = await page.$('#postloginform\\#\\/Academy\\/j_spring_security_check');
  await elementHandle.click();//clicking the login button


  // Wait for the navigation to complete after successful login
  await page.waitForNavigation();
  if (page.url() === profileUrl) {
    console.log("Login successful");//to confirm if login was successful
    await new Promise(resolve => setTimeout(resolve,2500));//wait for profice page to load 
    //here the wait time is 2.5s ,adjust it accordingly if you feel its necessary 
    //example poor network speed
    const menuTab = await page.$('#menuTab_660');//clicks on myAttendance Tab
    await menuTab.click();
    console.log("Clicked on the tab successfully");
    
    //extract attendance from here
    await page.waitForSelector('#studentAttendanceSemester table tbody');
    const tableData = await page.$$eval('#studentAttendanceSemester table tbody tr', (rows) => {
      return rows.map((row) => {
        return Array.from(row.querySelectorAll('td, th'), (cell) => cell.textContent.trim());
      });
    });
    console.table(tableData);
  }else {
    console.error("Login failed");
  }
  // Close the browser
  await browser.close();
})();
