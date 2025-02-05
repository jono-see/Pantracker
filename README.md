# Pantracker
## Important Note

Even though it is linked to Heroku, the app should be run locally to ensure all functionality works properly. 

The 'product search'  front end functionality does not work on heroku. Because Heroku requires a response within 30 seconds before throwing a H12 error, the 'product/search' functionality re-renders the homepage before completing the web scraping in the background. This means for the front end,  we must keep checking whether results have been returned, this checking is done using Javascript in the 'productSearch.pug' file. This works fine when running the app locally and renders the results without an issue. Furthermore, when running the app online 'searchResults' are returned to '/user/data'. However, for some reason they are not rendered. A similar issue occurs when trying to render "logged in as 'username'". The username value exists in the backend under 'user/sessionId', but is not rendered in the 'index.pug' file.

Furthermore, for an unknown reason, some elements on the front page display incorrectly on Heroku, despite working properly when run locally on several different devices. Some elements will show when they are not supposed to, allowing users to search when they are not logged in.

## Key functionalities

### Product Search
Allows users to search for products from a number of different stores nearby (currently works for Woolworths, Officeworks and BigW). On the left side of the homepage (https://info30005-pantracker.herokuapp.com/), once logged in (see below for user registration information) users can search for product availability by entering a product name, location, and depth (how many results to return from each store). The online stores of Woolworths, Officeworks, and Big W are then searched using the paramters provided. 

Note: the search is quite finicky, it is prefered if you set `depth = 1`.

The scraping functionality uses the "puppeteer" package which is aproximately 300mb, thus it is included in the .gitignore file. Furthermore, to use the package on a cloud service, like Heroku, it requires the installation of a buildpack (heroku buildpacks:add jontewks/puppeteer). Thus the final push to the heroku server was done through the Heroku CLI and not through Github.

#### Links
Search terms entered on homepage:
- https://info30005-pantracker.herokuapp.com/

Redirects users to this page:
- https://info30005-pantracker.herokuapp.com/product/search/


#### Associated files
Views:          /views/productSearch.pug<br/>
Routes:         /routes/productRouter.js<br/>
Controllers:    /controllers/scrapeBigW.js, /controllers/scrapeOfficeworks.js, /controllers/scrapeWoolworths.js<br/>
Models:         /models/user.js<br/>

### User Registration
Allows the registration and authentication of a user, if they provide a valid email address and password. Users' searches are linked to their accounts to ensure all website users do not receive the same search results.

#### Links
Users can log-in or register from this page:
- https://info30005-pantracker.herokuapp.com/user/

Sample login: <br/>
Username: test@test.com <br/>
Password: test

#### Associated files
Views:          /views/user.pug<br/>
Routes:         /routes/userRouter.js<br/>
Controllers:    /controllers/userController.js<br/>
Models:         /models/user.js<br/>

### Store Details and Rating
Allows users to find out more information about a store (address, location on map, rating), then rate the store if they found the products they were looking for there. Users can only rate each store once daily, handled by browser cookies. This page also displays the 3 stores nearest to the store being viewed.

#### Links
Store details can be found on this page:
- https://info30005-pantracker.herokuapp.com/stores/[id]
For example: https://info30005-pantracker.herokuapp.com/stores/167

Links to stores are available from the "Nearest Stores" page, outlined below, or the "Product search" pages, outlined above.

#### Associated files
Views:          /views/storePage.pug<br/>
Routes:         /routes/storeRouter.js<br/>
Controllers:    /controllers/storeController.js<br/>
Models:         /models/stores.js<br/>

### Nearest Stores
Allows users to find the nearest 5 stores to a postcode they provide. On the homepage (https://info30005-pantracker.herokuapp.com/), users can enter a postcode and search radius in the search bar on the right (under SEARCH FOR NEARBY STORES) then search, which will redirect them to the appropriate page.

On this page a map will be displayed, centred at the postcode they searched for, showing any stores that fall within the radius they specified. The store names will also be listed beneath the map, with links to the "Store details and rating" pages. Clicking on the markers on the map will also show users more info about the store at that location and provide them with a link to the relevant "Store details and rating" page.

#### Links
Search terms entered on homepage:
- https://info30005-pantracker.herokuapp.com/

Redirects users to this page:
- https://info30005-pantracker.herokuapp.com/stores/postcode/[postcode]/[radius]

For example: https://info30005-pantracker.herokuapp.com/stores/postcode/3000/5

#### Associated files
Views:          /views/nearestStores.pug<br/>
Routes:         /routes/storeRouter.js<br/>
Controllers:    /controllers/storeController.js<br/>
Models:         /models/stores.js<br/>

### URL parameters

[id] - store id, numbers between 1 and XX for this dataset

[postcode] - any victorian postcode, in format 3XXX

[radius] - search radius in km for nearest stores to be displayed within, any number



## Testing
Testing focused on the store search functionality.
Test 1: Tests a valid postcode for nearby search
Test 2: Tests a valid store id
Test 3: Tests an invalid id

To test run: "npm test"


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

