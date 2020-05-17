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

### Store details and rating
Allows users to find out more information about a store (address, location on map, rating), then rate the store if they found the products they were looking for there. Users can only rate each store once daily, handled by browser cookies. This page also displays the 3 stores nearest to the store being viewed.

Available at:
https://info30005-pantracker.herokuapp.com/stores/[id]

Links to stores are available from the "Nearest stores" page, outlined below.


### Nearest stores
Allows users to find the nearest 5 stores to a postcode they provide. On the homepage (https://info30005-pantracker.herokuapp.com/), users can enter a postcode in the search bar on the right (under SEARCH FOR NEARBY STORES) then search, which will redirect them to the following URL:

https://info30005-pantracker.herokuapp.com/stores/postcode/[postcode]

On this page a map will be displayed, centred at the postcode they searched for, showing the 5 nearest stores to that postcode. The store names will also be listed beneath the map, with links to the "Store details and rating" pages. Clicking on the markers on the map will also show users more info about the store at that location and provide them with a link to the relevant "Store details and rating" page.

### URL parameters

[id] - store id, numbers between 1 and XX for this dataset

[postcode] - any victorian postcode, in format 3XXX



## Data Sources
This project is linked to MongoDB, using two collections. The first, "AllStores", contains relevant information about all Woolworths, Big W, and Officeworks stores in the state. The data is in the following format:

```
{
    "_id":1,                                        // store id
    "name":"Big W Narre Warren",                    // store name
    "brand":"Big W",                                // brand - one of "Big W", "Officeworks", "Woolworths", "Metro"
    "address":"352 Princes Hwy, Narre Warren",      // store address
    "postcode":"3805",                              // store postcode
    "latitude":-37.815699,                          // latitude of the store (as a float)
    "longitude":144.955957,                         // longitude of the store (as a float)
    "accurateYes":1,                                // number of users who have positively rated store (default is 1)
    "accurateNo":0                                  // number of users who have negatively rated store (default is 0)
 }
 ```
 
 The second collection, "User", stores information about registered users to the app. Data is in the following format:
 ```
 {
    "_id":"5ec0463dd151ccc8fca35ad6"            // automatically generated user id
    "name":"michael"                            // username
    "password":                                 // hashed password
    "searchResults":Array                       // the current results of the user's search, to get around limits on heroku
 }
 ```

