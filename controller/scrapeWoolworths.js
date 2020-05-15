const puppeteer = require("puppeteer");

async function scrapeWoolworths(productName, postcode, depth) {

    let puppeteerArgs = [
        '--no-sandbox',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];

    let searchUrl = 'https://www.woolworths.com.au/shop/search/products?searchTerm=' + productName;

    let browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs
    });

    let page = await browser.newPage();

    await page.goto(searchUrl, { 'waitUntil':'networkidle2' });

    let hrefs = await page.evaluate(() => {

        hrefs = [...document.querySelectorAll('shared-product-tile')].map(x => x.querySelector("section > div > a").getAttribute("href"));

        return hrefs;
    
    });

    let products_list = [];

    for (let i = 0; i < depth; i++) {
        
        console.log("https://www.woolworths.com.au/" + hrefs[i]);

        await page.goto("https://www.woolworths.com.au/" + hrefs[i], { 'waitUntil':'networkidle2' });

        let product = await page.evaluate(() => {

            productPrice = document.querySelector("shared-price").innerText.replace(/\s+/g, '.');
            productName = document.querySelector("h1[class *= 'title']").innerText;
            
            product = {"productName": productName, "productPrice": productPrice};

            return product;

        });

        await page.click("span[class = 'stockChecker-label']");
        await page.waitFor(100);
        await page.type("#pickupAddressSelector", postcode);
        await page.keyboard.press('Enter');
        // debugger;
        await page.waitFor(1000);

        let storesLength = await page.evaluate(() => {
            
            storesLength = [...document.querySelectorAll("div[class = 'stockChecker-sectionItemHeader']")].length;

            return storesLength;

        });

        let products = await page.evaluate(() => {
            
            stores = [...document.querySelectorAll("div[class = 'stockChecker-sectionItemHeader']")]

            products = [];

            stores.forEach((store) => {

                new_product = {...product};

                new_product["storeName"] = "Woolworths";
                new_product["storeLocation"] = store.querySelector("div > div > div > h3").innerText;
                new_product["stockStatus"] = store.querySelector("div > div > div > div > span:nth-child(3)").innerText;
                new_product["storeNo"] = "Unknown";

                products.push(new_product);

            });

            return products;

        });

        products.map(x => products_list.push(x));

    };

    await browser.close();

    return products_list;

};


// scrapeWoolworths("Apple", "3000", "5").then((val) => console.log(val));

module.exports = scrapeWoolworths;

