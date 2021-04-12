let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let COLLECTION = require('../../constants/fz-db-collection-name');

let SUBSCRIPTION_SCHEMA = () => {
    let subscripionSchema = new Schema({
        timestamp : {type: Number, required: true},
        publicId : {type: String, required: true, unique: true}
    });
    mongoose.model(COLLECTION.SUBSCRIPTION, subscripionSchema);
};

module.exports = SUBSCRIPTION_SCHEMA();