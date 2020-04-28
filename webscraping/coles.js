const puppeteer = require("puppeteer");

(async() => {

    let puppeteerArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];

    const url = 'https://www.woolworths.com.au/shop/search/products?searchTerm=apple'

    let browser = await puppeteer.launch({
        headless: false,
        args: puppeteerArgs
    });

    let page = await browser.newPage();

    await page.goto(url, { 'waitUntil':'networkidle2' });

    const hrefs = await page.evaluate(() => {

        products = document.querySelectorAll('shared-product-tile');
        products = [...products];
        hrefs = products.map(x => x.querySelector("section > div > a").getAttribute("href"));
    
        return hrefs;
    
    });

    products = Array();

    for (let i = 0; i < 5; i++) {
        
        await page.goto("https://www.woolworths.com.au/" + hrefs[i], { 'waitUntil':'networkidle2' });

        let product = await page.evaluate(() => {

            productPrice = document.querySelector("shared-price").innerText.replace(/\s+/g, '.');
            productName = document.querySelector("h1[class *= 'title']").innerText;
            
            product = {name: productName, price: productPrice, store: "Woolworths"};

            return product;

        });

        await page.click("span[class *= 'stockChecker']");
        await page.waitFor(100);
        await page.type("#pickupAddressSelector", "3150");
        await page.keyboard.press('Enter');
        
        try {

            let store = await page.evaluate(() => {
                
                information = document.querySelector("div[class *= 'ItemStore']").innerText;

                return information;
            });

            product["store"] = store;

        } catch {

            product["store"] = "unavailable";

        }

        // product[store] = store;

        products.push(product);

    }

    debugger;

})();




// await page.click("span[class *= 'stockChecker']");
// await page.type("#pickupAddressSelector", "3150");
// await page.keyboard.press('Enter');




// for (let i = 0; i < hrefs.len; i++) {

//     productPrice = document.querySelector("shared-price").innerText.replace(/\s+/g, '.');
//     productName = document.querySelector("h1[class *= 'Title']").innerText;
    
//     product = {name: productName, price: productPrice, store: "Woolworths"};

//     return product;

// }

// await page.click("span[class *= 'stockChecker']");
// await page.type("#pickupAddressSelector", "3150");
// await page.keyboard.press('Enter');

// }


// await page.click("span[class *= 'stockChecker']");
// await page.type("#pickupAddressSelector", "3150");
// await page.keyboard.press('Enter');