const puppeteer = require("puppeteer");

async function scrapeOfficeworks(prod, pcode) {

    let puppeteerArgs = [
        '--no-sandbox',
        // '--disable-setuid-sandbox',
        // '--disable-infobars',
        // '--window-position=0,0',
        // '--ignore-certifcate-errors',
        // '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];

    // let postcode = pcode;
    let postcode = pcode;
    let storelocator_url = "https://www.officeworks.com.au/shop/officeworks/storelocator/" + postcode;

    // let product = prod;
    let product_name = prod;
    let search_url = "https://www.officeworks.com.au/shop/officeworks/search?q=" + product_name;

    let browser = await puppeteer.launch({
        headless: true,
        args: puppeteerArgs
    });

    let page = await browser.newPage();

    await page.goto(storelocator_url, { 'waitUntil':'networkidle2' });

    await page.click("body > div.ow-app > div.sc-bdVaJa.sc-htoDjs.Container__StyledContainer-cnb0ed-0.yEJoX > div.sc-bdVaJa.sc-bwzfXH.StoreList__StoreListDesktopWrapper-sc-1fks3a1-7.dFeVhM > div.sc-bdVaJa.StoreList__StoreListWrapper-sc-1fks3a1-0.jBdXbF > div.sc-bdVaJa.StoreList__DesktopStoreListItemWrapper-sc-1fks3a1-2.hZsDTi.sc-bwzfXH.eVPJMi > div > div > div.StoreBasicInfo__MLBox-bvo2ec-4.BzuTa > div:nth-child(2) > div.StoreBasicInfo__LineBox-bvo2ec-2.lcpjPy > a");

    await page.goto(search_url, { 'waitUntil':'networkidle2' });

    let hrefs = await page.evaluate(() => {

        products = document.querySelectorAll("div[class *= 'ProductTile'] > a")

        hrefs = Array(products.length)

        for (let i = 0; i < products.length; i++) {
            hrefs[i] = products[i].getAttribute("href")
        }

        return hrefs;

    });

    let products = Array();

    for (let i = 0; i < 2; i++) {
        
        try {
            await page.goto("https://www.officeworks.com.au" + hrefs[i], { 'waitUntil':'networkidle2' });

            let product = await page.evaluate(() => {

                productPrice = document.querySelector("span[class *= 'Price'] > span").innerText;
                productName = document.querySelector("h1[class *= 'Title']").innerText;
                productStatus = document.querySelectorAll("div[class *= 'ProductAvailability'] > strong")[1].innerText;
                product = {name: productName, price: productPrice, status: productStatus, store: "Officeworks"};
        
                return product;
        
            });

            products.push(product);

        } catch(error) {
            console.log(error)
        }

    };

    await browser.close();

    return products;

};

module.exports=scrapeOfficeworks;

// scrapeOfficeworks().then((val) => console.log(val));