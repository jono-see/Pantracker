var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    brand: String,
    address: String,
    postcode: String,
    latitude: String,
    longitude: String,
    accurateYes: Number,
    accurateNo: Number,
}, {collection: 'AllStores'});

mongoose.model('allStores', storeSchema);