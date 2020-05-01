# Pantracker

## Key functionalities

### Search function

### Store rating

### Nearest stores
Allows users to find the nearest 3 stores from the sample dataset to a postcode they provide.

Can be accessed through this URL:
https://info30005-pantracker.herokuapp.com/stores/postcode/\<postcode\>


### URL parameters

\<id\> - store id, any number between 1 and 6 for this sample data

\<postcode\> - any victorian postcode, in format 3XXX



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

