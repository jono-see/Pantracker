var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var woolworthsSchema = new Schema({
    "Location Name": {type: String, required: true},
    "Brand": String,
    "Internal Address": String,
    rating: String,
    photo: String
}, {collection: 'WoolworthsStores'});

mongoose.model('woolworths', woolworthsSchema);