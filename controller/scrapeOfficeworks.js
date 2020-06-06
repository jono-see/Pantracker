const puppeteer = require("puppeteer");

async function scrapeOfficeworks(productName, postcode, depth) {

    let puppeteerArgs = [
        '--no-sandbox',
        '--user-agent="user"'
    ];

    let storelocator_url = "https://www.officeworks.com.au/shop/officeworks/storelocator/" + postcode;
    let search_url = "https://www.officeworks.com.au/shop/officeworks/search?q=" + productName;

    let browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs
    });

    let page = await browser.newPage();

    let products = [];

    await page.goto(storelocator_url, { 'waitUntil':'networkidle2' });

    storesLength = await page.evaluate(() => {

        storesLength = document.querySelectorAll("div[data-ref = 'store-list'] > div").length;

        return storesLength;

    });

    for (let n = 1; n <= storesLength; n++) {

        await page.goto(storelocator_url, { 'waitUntil':'networkidle2' });

        clickSelector = "div[data-ref = 'store-list'] > div:nth-child(" + n + ") > div > div > div > div > div";

        await page.click(clickSelector);

        await page.goto(search_url, { 'waitUntil':'networkidle2' });

        let hrefs = await page.evaluate(() => {

            hrefs = [...document.querySelectorAll("div[class *= 'ProductTile'] > a")].map(x => x.getAttribute("href"));

            return hrefs;

        });

        for (let i = 0; i < depth; i++) {

            try {

                console.log("https://www.officeworks.com.au" + hrefs[i]);

                await page.goto("https://www.officeworks.com.au" + hrefs[i], { 'waitUntil':'networkidle2' });

                let product = await page.evaluate(() => {

                    productPrice = document.querySelector("span[class *= 'Price'] > span").innerText;
                    productName = document.querySelector("h1[class *= 'Title']").innerText;
                    productStatus = document.querySelectorAll("div[class *= 'ProductAvailability'] > strong")[1].innerText;
                    storeName = document.querySelector("a[data-ref = 'store-name']").innerText;
                    storeLocation = document.querySelector("div[class *= 'ProductAvailability'] > small").innerText;
                    product = {"productName": productName, "productPrice": productPrice, "productStatus": productStatus, "storeName": storeName, "storeLocation": storeLocation, "storeNo": "Unavailable"};
            
                    return product;
            
                });

                product["productUrl"] = "https://www.officeworks.com.au" + hrefs[i];

                products.push(product);

            } catch(error) {

                console.log(error)

            }

        };

    };



    await browser.close();

    return products;

};

module.exports = scrapeOfficeworks;

// scrapeOfficeworks("Apple", "3150", 1).then((val) => console.log(val));