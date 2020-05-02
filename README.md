# Pantracker

## Key functionalities

### Search function
Allows users to search for products from a number of different stores nearby (currently works for Woolworths, Officeworks and BigW).

The scraping functionality uses the "puppeteer" package which is aproximately 300mb, thus it is included in the .gitignore file. Furthermore, to use the package on a cloud service, like Heroku, it requires the installation of a buildpack (heroku buildpacks:add jontewks/puppeteer). Thus the final push to the heroku server was done through the Heroku CLI and not through Github.

- https://info30005-pantracker.herokuapp.com/product (GET)
displays all products that have been searched for

- https://info30005-pantracker.herokuapp.com/product/search (POST)
searches for a product, given a specific "productName", "postcode" and "depth" which limits the number of results found.
sample input would be {"productName": "tomato", "postcode": "3000", "depth": "1"} (POST)

- https://info30005-pantracker.herokuapp.com/product/clear (GET)
clear the products that have been searched for using

### Store rating
Allows users to rate whether they found the product/s they were looking for at a given store. Values can either be changed using on-screen buttons (currently non-functional), or by HTML request.


URL for seeing store rating (Note: Displays a HTML page):

https://info30005-pantracker.herokuapp.com/stores/[id]





Increase or decrease rating by URL:

https://info30005-pantracker.herokuapp.com/stores/[id]/plus

https://info30005-pantracker.herokuapp.com/stores/[id]/minus



### Nearest stores
Allows users to find the nearest 3 stores to a postcode they provide from the sample dataset.

Can be accessed through this URL:

https://info30005-pantracker.herokuapp.com/stores/postcode/[postcode]


Users are also able to find the 3 closest stores to a given store through this URL:

https://info30005-pantracker.herokuapp.com/stores/[id]/closest


### URL parameters

[id] - store id, any number between 1 and 6 for this sample data

[postcode] - any victorian postcode, in format 3XXX



## Data Sources
While the project is linked to MongoDB, the project still runs of a sample dataset instead of the database, located at
/models/store.js. The data is in the following format:

```
{
    "id":1,                                             // store id
    "name":"Woolworths - Bourke St Metro",              // store name
    "lat":-37.815699,                                   // latitude of the store
    "long":144.955957,                                  // longitude of the store
    "address":"600 Bourke St, Melbourne VIC 3000",      // store address
    "accurateYes":13,                                   // sample of number of users who have positively rated store
    "accurateNo":2                                      // sample of number of users who have negatively rated store
 }
 ```

