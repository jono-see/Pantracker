var request = require("request");
var mongoose = require('mongoose');
var Stores = mongoose.model('allStores');

// Constants for the number of nearest stores to calculate
const N_TO_LIST = 3;

// Constants for Google Maps and Mapbox APIs
const URL_BASE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const API_KEY = "AIzaSyDyB-JHeX5-lGAklEsl4vpZvayACIcGX6k";
const MAPBOX_KEY = "pk.eyJ1Ijoic2hlbmJsYWNrIiwiYSI6ImNrYTV6aXlhdjAyamMzMHBhNjlka2Rtb24ifQ.41KtCaLJ_lQclxP4ARKU8Q";

// Calculates the distance between two sets of latitude/longitude
function haversineDistance(lat1, lon1, lat2, lon2) {
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

// Calculates the distance from coordinates to each store then returns closest stores
async function distanceMatrix (lat,long,store_id=-1,distance){
    var i;
    var dist;
    var all_dist = [];
    var closest_dist = [];

    // Finds all stores from the database so that distances can be measures
    await Stores.find(function(err, stores) {

        // Calculate the distance to each store
        for (i = 0; i < stores.length; i++) {
            dist = haversineDistance(lat,long,stores[i].latitude,stores[i].longitude);
            if (stores[i]._id != store_id) {
                all_dist.push([stores[i]._id,dist]);
            }
        }

        // Sort list into ascending distance order
        all_dist = all_dist.sort(function(a, b) {
            var x = a[1];
            var y = b[1];
            return x - y;});

        if (store_id != -1) {
            // Creates array to return with only N_TO_LIST closest stores
            for (i = 0; i < N_TO_LIST; i++) {
                var id = all_dist[i][0];
                store = stores.find(store => store._id === id);
                var rating = 0;
                if (store["accurateYes"] + store["accurateNo"] > 0) {
                    rating = (store["accurateYes"] / (store["accurateYes"] + store["accurateNo"]))*100;
                }

                // Add relevant data to array to be later sent to pug page
                closest_dist.push({
                    "id":id,
                    "name":store.name,
                    "address":store.address,
                    "distance":all_dist[i][1],
                    "rating":rating,
                    "lat":store.latitude,
                    "long":store.longitude
                });
            }
        } else {
            for (i = 0; i < all_dist.length; i++) {
                if (all_dist[i][1] <= distance) {
                    var id = all_dist[i][0];
                    store = stores.find(store => store._id === id);
                    var rating = 0;
                    if (store["accurateYes"] + store["accurateNo"] > 0) {
                        rating = (store["accurateYes"] / (store["accurateYes"] + store["accurateNo"]))*100;
                    }

                    // Add relevant data to array to be later sent to pug page
                    closest_dist.push({
                        "id":id,
                        "name":store.name,
                        "address":store.address,
                        "distance":all_dist[i][1],
                        "rating":rating,
                        "lat":store.latitude,
                        "long":store.longitude
                    });
                } else {
                    break
                }
            }
        }
        if (closest_dist.length == 0) {
            closest_dist = "No stores nearby"
        }
        return closest_dist;
    });
    if (closest_dist.length == 0) {
        closest_dist = "No stores nearby"
    }
    return closest_dist;
}

// Increases either the accurateYes or accurateNo values in the data
async function changeValue(id, to_change, current_value) {

    // Works out whether to increase yes or no values
    if (to_change == "accurateYes") {
        var newValue = current_value + 1;
        await Stores.updateOne({_id: id}, {accurateYes: newValue});
    } else if (to_change == "accurateNo") {
        var newValue = current_value + 1;
        await Stores.updateOne({_id: id}, {accurateNo: newValue});
    }
}

// Gets the 5 closest stores to the postcode provided
const nearestStores = async (req, res) => {
    var postcode = req.params.id;
    var distance = req.params.distance;
    var page_title = "Stores closest to postcode "+postcode;

    // Ensures a valid Victorian postcode is provided before searching
    if (!(postcode[0] == "3" && postcode.length == 4)) {
        res.render('error', {
            message:"Not a valid Victorian postcode"
        });
    } else if (isNaN(distance)) {
        res.render('error', {
            message:"Distance must be a number"
        });
    }
    else {
        distance = parseInt(distance);
        var address = postcode + "+VIC+Australia";
        var url = URL_BASE + address + "&key=" + API_KEY;
        var coords = [];
        var data = {};
        var closest_stores;

        var req = request({
                url: url,
                json: true
            },
            async function (error, response, body) {
                data = body;
                coords.push(data["results"][0]["geometry"]["location"]["lat"]);
                coords.push(data["results"][0]["geometry"]["location"]["lng"]);
                closest_stores = await distanceMatrix(coords[0], coords[1], -1, distance);

                // Renders the nearestStores pug page with relevant data
                res.render('nearestStores', {
                    title:page_title,
                    postcode:postcode,
                    p_lat:coords[0],
                    p_long:coords[1],
                    closest_stores:closest_stores,
                    MAPBOX_KEY: MAPBOX_KEY
                });
            });
    }
};

// Provides information about a given store
const storeID = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.render('error', {
            message:"Invalid store id"
        });
    }
    var exists = await Stores.exists({_id: req.params.id});

    // Ensures that is is a valid store id
    if (!exists) {
        res.render('error', {
            message:"Invalid store id"
        });
    } else {

        // Finds the relevant store within the database
        Stores.findById(req.params.id, async function (err, store) {
            const store_name = store.name;
            const acc_yes = store.accurateYes;
            const acc_no = store.accurateNo;
            var percent = 0;
            if (acc_yes + acc_no > 0) {
                percent = (acc_yes) / (acc_no + acc_yes) * 100;
            }
            var closest_stores = await distanceMatrix(store.latitude, store.longitude, store._id, 0);

            return res.render('storePage', {
                title: store_name,
                id: store._id,
                name: store_name,
                accurateYes: acc_yes,
                accurateNo: acc_no,
                percent: percent,
                address: store.address,
                lat: store.latitude,
                long: store.longitude,
                closest_stores: closest_stores,
                API_KEY: API_KEY,
                MAPBOX_KEY: MAPBOX_KEY
            })
        });
    }
};

// Increases the yes accuracy value
const increaseYes = async (req, res) => {
    var exists = await Stores.exists({_id: req.params.id});

    // Determines that is is a valid store id
    if (exists) {
        Stores.findById(req.params.id, function (err, store) {

            changeValue(req.params.id, "accurateYes", store.accurateYes);
            res.redirect("/stores/" + req.params.id);
        })
    } else {
        res.render('error', {
            message:"Invalid store id"
        });
    }
};

// Increases the no accuracy value
const increaseNo = async (req, res) => {
    var exists = await Stores.exists({_id: req.params.id});

    // Determines that is is a valid store id
    if (exists) {
        Stores.findById(req.params.id, function (err, store) {
            changeValue(req.params.id, "accurateNo", store.accurateNo);
            res.redirect("/stores/" + req.params.id);
        })
    } else {
        res.render('error', {
            message:"Invalid store id"
        });
    }
};

module.exports = {
    nearestStores,
    storeID,
    increaseYes,
    increaseNo
};