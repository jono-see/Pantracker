const puppeteer = require("puppeteer");

async function scrapeBigW(productName, postcode, depth) {

    let puppeteerArgs = [
        '--no-sandbox',
        '--user-agent="let me scrape u plz"'
    ];

    locationUrl = "https://www.bigw.com.au/";
    productUrl = "https://www.bigw.com.au/search/?category=&text=" + productName;

    let browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs
    });
    
    let page = await browser.newPage();

    await page.goto(locationUrl, { 'waitUntil':'networkidle2' });

    await page.click("#locationLink > span");
    await page.type("#userLocationInput", postcode);
    await page.waitFor(500);
    await page.click("ul[class *= 'autocomplete'] > :first-child");

    await page.goto(productUrl, { 'waitUntil':'networkidle2' });
    await page.waitFor(500);

    let hrefs = await page.evaluate(() => {

        let productSlots = document.querySelectorAll("div[class *= 'productSlot']");
        productSlots = [...productSlots];
        hrefs = productSlots.map(x => x.querySelector("div > div > a").getAttribute("href"));

        return hrefs;

    });

    let products_list = [];

    for (i = 0; i < depth; i++) {

        try {

            console.log(hrefs[i]);

            await page.goto("https://www.bigw.com.au" + hrefs[i], { 'waitUntil':'networkidle2' });

            await page.waitFor(100);

            let product = await page.evaluate(() => {

                var productPrice = document.querySelector("div[class *= 'online-price']").innerText.replace(/\s+/g, '');
                var productName = document.querySelector("h1[class *= 'product-name']").innerText;

                var product = {"productPrice": productPrice, "productName": productName};

                return product;

            });

            await page.waitFor(100);

            await page.click("li[class *= 'instore']");

            let products = await page.evaluate(() => {

                let products = [];

                stores = document.querySelectorAll("li[class = 'bordered IconlistView']");
                stores = [...stores];

                for (j = 0; j < stores.length; j++) {
                
                    var new_product = {}

                    new_product["productStatus"] = stores[j].querySelector("span[class *= 'statusIcon']").innerText;
                    new_product["storeName"] = stores[j].querySelector("strong").innerText;
                    new_product["storeAddress"] = stores[j].querySelector("div[class *= 'addressList']").innerText;
                    new_product["storeNo"] = stores[j].querySelector("a[class *= 'callStore']").innerText;
    
                    products.push(new_product);
    
                };

                return products;

            });

            for (k = 0; k < products.length; k++) {
                products[k]["productPrice"] = product["productPrice"];
                products[k]["productName"] = product["productName"];
            };

            products.map(x => products_list.push(x));

        } catch(err) {

            console.log(error);

        }

    }

    await browser.close();

    return products_list;

};

// scrapeBigW("Carrot", "3150", "5").then((val) => console.log(val));

module.exports = scrapeBigW;

