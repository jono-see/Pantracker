var stores = require("../../models/store");
var request = require("request");

var N_TO_LIST = 3;

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
function distanceMatrix(lat,long,store_id=-1){
    var i;
    var dist;
    var all_dist = [];
    var closest_dist = [];

    // Calculate the distance to each store
    for (i = 0; i < stores.length; i++) {
        dist = haversineDistance(lat,long,stores[i]["lat"],stores[i]["long"]);
        if (stores[i]["id"] != store_id) {
            all_dist.push([stores[i]["id"],dist]);
        }
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
    var postcode = req.params.id;

    // Ensures a valid Victorian postcode is provided before searching
    if (!(postcode[0] == "3" && postcode.length == 4)) {
        res.send("Not a valid Victorian postcode");
    }
    else {
        var address = postcode + "+VIC+Australia";
        var url = URL_BASE + address + "&key=" + API_KEY;
        var coords = [];
        var data = {};
        var closest_stores;

        var req = request({
                url: url,
                json: true
            },
            function (error, response, body) {
                data = body;
                coords.push(data["results"][0]["geometry"]["location"]["lat"]);
                coords.push(data["results"][0]["geometry"]["location"]["lng"]);
                closest_stores = distanceMatrix(coords[0], coords[1]);
                res.send(closest_stores)
            });
    }
};

// Returns the closest stores to a different given store
const listStores = (req, res) => {
    const curr_store = stores.find(store => store.id == req.params.id);

    if (!curr_store) {
        res.send("Not a valid store id");
    } else {
        var closest_stores;
        var coords = [];

        closest_stores = distanceMatrix(curr_store["lat"], curr_store["long"], curr_store["id"]);
        res.send(closest_stores);
    }
};

// Provides information about a given store
const storeID = (req, res) => {
    const store = stores.find(store => store.id == req.params.id);

    // Ensures that a valid store id is given before listing
    if (!store) {
        res.send("Not a valid store id");
    } else {
        const store_name = store.name;
        const acc_yes = store.accurateYes;
        const acc_no = store.accurateNo;
        const percent = (acc_yes) / (acc_no + acc_yes) * 100;

        res.render('storePage', {
            title: store_name, accurateYes: acc_yes,
            accurateNo: acc_no, percent: percent, store: store
        })
    }
};

// Increases the yes value
const increaseYes = (req, res) => {
    const store = stores.find(store => store.id == req.params.id);
    if (store) {
        store.accurateYes++;
        const percent = (store.accurateYes)/(store.accurateYes + store.accurateNo) * 100;
        res.render('storePage', { title: store.name, accurateYes: store.accurateYes,
            accurateNo: store.accurateNo, percent: percent, store: store })
    }
};

// Increases the no value
const increaseNo = (req, res) => {
    const store = stores.find(store => store.id == req.params.id);
    if (store){
        store.accurateNo++;
        const percent = (store.accurateYes)/(store.accurateYes + store.accurateNo) * 100;
        res.render('storePage', { title: store.name, accurateYes: store.accurateYes,
            accurateNo: store.accurateNo, percent: percent, store: store })
    }
};

module.exports = {
//    displayMap,
    listStores,
    storeID,
    listStoresByPostcode,
    increaseYes,
    increaseNo
};