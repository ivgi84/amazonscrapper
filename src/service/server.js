import puppeteer from 'puppeteer';
import fs from 'fs';


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  });
const page = await browser.newPage();

await page.goto('https://www.amazon.com/s?k=wrench+mask&i=toys-and-games&sprefix=wrench%2Ctoys-and-games%2C395&ref=nb_sb_ss_pltr-ranker-opsacceptance_1_6');

//const selector = 'div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item:not(.AdHolder)';
const selector = '[data-component-type="s-search-result"].s-result-item:not(.AdHolder)';
const allProductsHandle = await page.$$(selector);

let items = [];
let isNextBtnDisabled = false;

while(!isNextBtnDisabled) {
  await page.waitForSelector('[data-component-type="s-search-results"] ');
  for(const productHandle of allProductsHandle) {
    await getAndPushItemInfo(productHandle);
  }

  await page.waitForSelector('.s-pagination-item', {visible: true});
  isNextBtnDisabled = await page.$('.s-pagination-item.s-pagination-next.s-pagination-disabled') != null;

  if(!isNextBtnDisabled) {
    clickNextButton();
  }
}

console.log('FINAL: ', items);

// setTimeout(async () => {
//   await browser.close();
// },  3000)

  async function getAndPushItemInfo(product) {
    try {
      const title = await page.evaluate(products => products.querySelector('h2 > a > span').textContent, product);
      const price = await page.evaluate(products =>  products.querySelector('.a-price > span.a-offscreen').textContent, product);
      const rate = await page.evaluate(products =>  products.querySelector('.a-icon-alt').textContent, product);
      const img = await page.evaluate(products => products.querySelector('img.s-image').src, product);
      
      if (title !== 'Null') {
        items.push({title, price, rate, img});
        saveItemToTheFile(title, price, rate, img)
      }    
    }
    catch (err) {}
  }

  async function clickNextButton() {
    await Promise.all([
      page.click('a.s-pagination-item.s-pagination-next'),
      page.waitForNavigation() // we need to wait for the navigation after the click
    ]);
  }

  async function saveItemToTheFile(title, price, rate, img) {
    fs.appendFile('results.csv', `"${title}", ${price}, ${rate}, ${img} \n`, (err)=> {
      if(err) throw err;
      console.log('****SAVED****');
    })
  }

})();

