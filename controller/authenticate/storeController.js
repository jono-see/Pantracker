var shen_lat = -37.772721;
var shen_long = 145.013858;
var stores = require("../../models/store");
var N_TO_LIST = 3;
var request = require("request");

var URL_BASE = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var API_KEY = "AIzaSyDyB-JHeX5-lGAklEsl4vpZvayACIcGX6k";

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
function distanceMatrix(lat,long){
    var i;
    var dist;
    var all_dist = [];
    var closest_dist = [];

    // Calculate the distance to each store
    for (i = 0; i < stores.length; i++) {
        dist = haversineDistance(lat,long,stores[i]["lat"],stores[i]["long"]);
        all_dist.push([stores[i]["id"],dist]);
    }

    // Sort list into ascending distance order
    all_dist = all_dist.sort(function(a, b) {
        var x = a[1];
        var y = b[1];
        return x - y;});

    // Creates array to return with only N_TO_LIST closest stores
    for (i = 0; i < N_TO_LIST; i++) {
        var id = all_dist[i][0];
        store = stores.find(store => store.id === id);
        closest_dist.push({
            "id":id,
            "name":store["name"],
            "address":store["address"],
            "distance":all_dist[i][1]
        });
    }
    return closest_dist;
}

/*
const displayMap = (req, res) => {
    var address = req.params.id + ", VIC, Australia"
    var content = https.get("https://maps.googleapis.com/maps/api/geocode/json?address=8+French+Ave,+Northcote+3070+VIC+Australia&key=AIzaSyDyB-JHeX5-lGAklEsl4vpZvayACIcGX6k");
    var to_map = distanceMatrix(shen_lat, shen_long);
    res.send(content);
};
*/

// Gets the 3 closest stores to the postcode provided
const listStoresByPostcode = (req, res) => {
    var address = req.params.id + "+VIC+Australia";
    var url = URL_BASE + address + "&key=" + API_KEY;
    var coords = [];
    var data = {};
    var closest_stores;

    var req = request({
            url: url,
            json: true
        },
        function(error, response, body) {
            data = body;
            coords.push(data["results"][0]["geometry"]["location"]["lat"]);
            coords.push(data["results"][0]["geometry"]["location"]["lng"]);
            closest_stores = distanceMatrix(coords[0],coords[1]);
            res.send(closest_stores)
        });
};

const listStores = (req, res) => {
    var store_id = req.params.id;
}

const storeID = (req, res) => {
    const store = stores.find(store => store.id == req.params.id);

    if(store) {
        res.send(store);
    }
};

module.exports = {
//    displayMap,
    listStores,
    storeID,
    listStoresByPostcode
};