# Pantracker

## Key functionalities

issues:

Currently the 'product search'  front end functionality is only working locally. Because Heroku requires a response within 30 seconds before throwing a H12 error, the 'product/search' functionality re renders the homepage before completing the web scraping in the background. This means for the front end,  we must keep checking whether results have been returned, this checking is done using Javascript in the 'productSearch.pug' file. This works fine when running the app locally and renders the results without an issue. Furthermore, when running the app online 'searchResults' are returned to '/user/data'. However, for some reason they are not rendered. A similar issue occurs when trying to render "logged in as 'username'". The username value exists in the backend under 'user/sessionId', but is not rendered in the 'index.pug' file.

Summary:

the '/' page and the '/product/search' page might not be working properly on heroku. the '/' page is meant to show which user is logged in and the '/product/search' page might forever load.
this might be because issues with heroku and '.script' in 'pug.js' files as there are no issues when the app is run locally. the app was build in this way, however, because heroku requires explicit routing responses within 30 seconds, therefore results from the webscraping must be checked for constantly. that is why this particular design pattern was used.

### Product Search
Allows users to search for products from a number of different stores nearby (currently works for Woolworths, Officeworks and BigW).

The scraping functionality uses the "puppeteer" package which is aproximately 300mb, thus it is included in the .gitignore file. Furthermore, to use the package on a cloud service, like Heroku, it requires the installation of a buildpack (heroku buildpacks:add jontewks/puppeteer). Thus the final push to the heroku server was done through the Heroku CLI and not through Github.

- https://info30005-pantracker.herokuapp.com/product/search (POST)
searches for a product, given a specific "productName", "postcode" and "depth" which limits the number of results found.
sample input would be ```{"productName": "tomato", "postcode": "3000", "depth": "1"}```

- https://info30005-pantracker.herokuapp.com/product/delete (GET)
clear the products that have been searched for using

### User Registration
Allows the registration and authentication of a user, if they provide a valid email address and password. Users' searches are linked to their accounts to ensure all website users do not receive the same search results.

- https://info30005-pantracker.herokuapp.com/user/? 

Sample login:
Username: test@test.com
Password: test

#### Associated files
Views:          /views/user.pug
Routes:         /routes/userRouter.js
Controllers:    /controllers/userController.js
Models:         /models/user.js

### Store Details and Rating
Allows users to find out more information about a store (address, location on map, rating), then rate the store if they found the products they were looking for there. Users can only rate each store once daily, handled by browser cookies. This page also displays the 3 stores nearest to the store being viewed.

Available at:
- https://info30005-pantracker.herokuapp.com/stores/[id]
For example: https://info30005-pantracker.herokuapp.com/stores/167

Links to stores are available from the "Nearest stores" page, outlined below.

#### Associated files
Views:          /views/storePage.pug
Routes:         /routes/storeRouter.js
Controllers:    /controllers/storeController.js
Models:         /models/stores.js

### Nearest Stores
Allows users to find the nearest 5 stores to a postcode they provide. On the homepage (https://info30005-pantracker.herokuapp.com/), users can enter a postcode and search radius in the search bar on the right (under SEARCH FOR NEARBY STORES) then search, which will redirect them to the following URL:

- https://info30005-pantracker.herokuapp.com/stores/postcode/[postcode]/[radius]
For example: https://info30005-pantracker.herokuapp.com/stores/postcode/3000/5

On this page a map will be displayed, centred at the postcode they searched for, showing any stores that fall within the radius they specified. The store names will also be listed beneath the map, with links to the "Store details and rating" pages. Clicking on the markers on the map will also show users more info about the store at that location and provide them with a link to the relevant "Store details and rating" page.

#### Associated files
Views:          /views/nearestStores.pug
Routes:         /routes/storeRouter.js
Controllers:    /controllers/storeController.js
Models:         /models/stores.js

### URL parameters

[id] - store id, numbers between 1 and XX for this dataset

[postcode] - any victorian postcode, in format 3XXX

[radius] - search radius in km for nearest stores to be displayed within, any number



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
    "username":"test@test.com"                  // email for log-in
    "password":                                 // hashed password
    "searchResults":Array                       // the current results of the user's search, to get around limits on heroku
 }
 ```

