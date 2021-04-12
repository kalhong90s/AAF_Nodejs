let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let COLLECTION = require('../../constants/fz-db-collection-name');

let SERVICE_SCHEMA = () => {
    let serviceSchema = new Schema({
        //secret_key : {type: String, required: true, unique: true},
        lastupdate : {type: Number, required: true},
        services : [{
            serviceId : {type: String, unique: false, required: true},
            gupServiceName : {type: String, unique: false, required: true},
        }]
    });

    mongoose.model(COLLECTION.SERVICE, serviceSchema);
}

module.exports = SERVICE_SCHEMA();