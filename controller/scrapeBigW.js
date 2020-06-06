const puppeteer = require("puppeteer");

async function scrapeBigW(productName, postcode, depth) {

    let puppeteerArgs = [
        '--no-sandbox',
        '--user-agent="user"'
    ];

    let locationUrl = "https://www.bigw.com.au/";
    let productUrl = "https://www.bigw.com.au/search/?category=&text=" + productName;

    let browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs
    });
    
    let page = await browser.newPage();

    await page.goto(locationUrl, { 'waitUntil':'networkidle2', timeout: 0 });
    
    await page.click("#locationLink");
    await page.type("#userLocationInput", postcode);
    await page.waitForFunction(`document.querySelectorAll(".ui-menu-item").length > 0`);
    await page.click("li[class = 'ui-menu-item']");

    await page.goto(productUrl, { 'waitUntil':'networkidle2' });
    await page.waitForFunction(`document.querySelectorAll(".productSlot").length > 0`);

    let hrefs = await page.evaluate(() => {

        let productSlots = [...document.querySelectorAll("div[class = 'productSlot']")];
        let hrefs = productSlots.map(x => x.querySelector("div > div > a").getAttribute("href"));

        return hrefs;

    });

    // console.log(hrefs);

    let products_list = [];

    for (i = 0; i < depth; i++) {

        try {

            console.log("https://www.bigw.com.au/" + hrefs[i]);

            let product_search_url = "https://www.bigw.com.au" + hrefs[i];

            await page.goto(product_search_url, { 'waitUntil':'networkidle2' });

            await page.waitFor(100);

            let product = await page.evaluate(() => {

                var productPrice = document.querySelector("div[class *= 'online-price']").innerText.replace(/\s+/g, '');
                var productName = document.querySelector("h1[class *= 'product-name']").innerText;

                var product = {"productPrice": productPrice, "productName": productName};

                return product;

            });
            
            // console.log(product);

            // await page.waitFor(500);

            // await page.click("a[data-target = '#FindInStore']");
            await page.waitForSelector("#FindInStoreHref");
            await page.evaluate(() => {document.querySelector("#FindInStoreHref").click();}); 
            // await page.waitForFunction(`document.querySelectorAll("#instoreListing > li").length > 0`);
            // await page.evaluate(() => {
            //     document.querySelector("#FindInStoreHref").click()
            // });

            await page.waitFor(500);

            let products = await page.evaluate(() => {


                // document.querySelector("#FindInStoreHref").click();

                let products = [];

                let stores = [...document.querySelectorAll("#instoreListing > li")];

                // console.log(stores);

                for (j = 0; j < stores.length; j++) {
                
                    var new_product = {};

                    if (stores[j].querySelector("a[class *= 'tock']").outerHTML.includes("Instock")) { 
                        new_product["productStatus"] = "In Stock";
                    } else { 
                        new_product["productStatus"] = "No stock";
                    }
                    // new_product["productStatus"] = stores[j].querySelector("span[class *= 'statusIcon']").innerText;
                    new_product["storeName"] = stores[j].querySelector("strong").innerText.replace("BIG W", "Big W");

                    // new_product["storeAddress"] = stores[j].querySelector("div[class *= 'addressList']").innerText;
                    // new_product["storeNo"] = stores[j].querySelector("a[class *= 'callStore']").innerText;

                    new_product["storeAddress"] = "Unavailable";
                    new_product["storeNo"] = "Unavailable";

                    // console.log(new_product);
    
                    products.push(new_product);
    
                };

                // console.log(products);

                return products;

            });

            for (k = 0; k < products.length; k++) {
                products[k]["productPrice"] = product["productPrice"];
                products[k]["productName"] = product["productName"];
                products[k]["productUrl"] = product_search_url;
            };

            products.map(x => products_list.push(x));

        } catch(err) {

            console.log(err);

        }

    }

    await browser.close();



    return products_list;

};

// scrapeBigW("Carrot", "3150", 3).then((val) => console.log(val));

module.exports = scrapeBigW;

