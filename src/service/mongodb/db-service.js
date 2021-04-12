const mongoose = require('mongoose');
const NODE = require('../../constants/fz-node-name');
const METHOD = require('../../constants/fz-db-methd');
const COMMAND = require('../../constants/fz-client-command-name');
const LOG = require('../../manager/log/log-manager');

/*if(validator.equalsValue(error.name.toLowerCase(), 'MongoError'.toLowerCase()) === true){
    -> example message response error
    //Error -> duplicate,
    {
        "driver":true,
        "name":"MongoError",
        "index":0,
        "code":11000,
        "errmsg":"E11000 duplicate key error collection: mongo.subscriptions index: publicId_1 dup key: { : \"ass@aix.com\" }"
    }
    
}else if(validator.equalsValue(error.name.toLowerCase(), 'ValidationError'.toLowerCase()) === true){
    -> example message response error
    //Error -> incorrect feild,
    {
        "errors":{
            "publicId":{
                "message":"Path `publicId` is required.",
                "name":"ValidatorError",
                "properties":{
                    "message":"Path `publicId` is required.",
                    "type":"required",
                    "path":"publicId"
                },
                "kind":"required",
                "path":"publicId"
            }
        },
        "_message":"Subscription validation failed",
        "message":"Subscription validation failed: publicId: Path `publicId` is required.",
        "name":"ValidationError"

    }
    
}else if(validator.equalsValue(error.name.toLowerCase(), 'MissingSchemaError'.toLowerCase()) === true){
    //-> example message response error
    //Error -> incorrect feild,
    {
        "message":"Schema hasn't been registered for model \"Subscriptiosns\".\nUse mongoose.model(name, schema)",
        "name":"MissingSchemaError"
    }
}else{

}*/

function DB_DATA (collection, condition, fields, data){
    let outData = {};
    if(collection){
        outData.collection = collection;
    }
    if(condition){
        outData.condition = condition;
    }
    if(fields){
        outData.fields = fields;
    }
    if(data){
        outData.data = data;
    }
    return outData;
}

function DB_LOG(instance, collection, condition, fields, data, command, method, inputResponse, reqTimeInMilliSec) {
    let resTimeInMilliSec = Date.now();
    let useTimeInMilliSec = resTimeInMilliSec - reqTimeInMilliSec;
    LOG.DEBUG.DEBUG.call(this,instance, `--------------- MongoDB ${method} ${collection} ---------------`);
    LOG.DEBUG.DEBUG.call(this,instance, `-|Request`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Condition:${condition ? JSON.stringify(condition) : ''}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Fields:${fields ? JSON.stringify(fields) : ''}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Data:${data ? JSON.stringify(data) : ''}`);
    LOG.DEBUG.DEBUG.call(this,instance, `-|Response`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Data:${inputResponse ? JSON.stringify(inputResponse) : ''}`);
    LOG.DEBUG.DEBUG.call(this,instance, `-|Time`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Request:InMilliSec:${reqTimeInMilliSec}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Response:InMilliSec:${resTimeInMilliSec}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Use:InMilliSec:${useTimeInMilliSec} ms`);

    let outputRequest = DB_DATA(collection, condition, fields, data);
    LOG.DETAILLOG.OUT_REQUEST(instance, undefined, NODE.MONGODB, command, outputRequest, outputRequest, '', method);
    // LOG.DETAILLOG.END(instance);
    LOG.DETAILLOG.IN_RESPONSE(instance, undefined, NODE.MONGODB, command, inputResponse, inputResponse, useTimeInMilliSec);
}

exports.INSERT = async function(instance, collection, data, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        let insert = mongoose.model(collection);
        result = await insert.create(data);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }

    if(result.name == "MongoError"){
        instance.mongoError = true;
        result.err = result.name;
    }

    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, undefined, undefined, data, COMMAND.DB_INSERT, METHOD.INSERT, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.READ_ALL = async function(instance, collection, fields, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        const read = mongoose.model(collection);
        let condition = {}; //for read all doc
        result = await read.find(condition, fields);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }

    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, undefined, fields, data, COMMAND.DB_READ, METHOD.READ, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.READ_MANY = async function(instance, collection, condition, fields, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        const read = mongoose.model(collection);
        result = await read.find(condition, fields);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }

    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, fields, undefined, COMMAND.DB_READ, METHOD.READ, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.READ_ONE = async function(instance, collection, condition, fields, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        /*if(!condition){
            return result;
        }*/
        const read = mongoose.model(collection);
        result = await read.findOne(condition, fields);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, fields, undefined, COMMAND.DB_READ, METHOD.READ, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.READ_FIRST = async function(instance, collection, fields, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        const read = mongoose.model(collection);
        result = await read.findOne(fields);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, undefined, fields, undefined, COMMAND.DB_READ, METHOD.READ, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.UPDATE_ALL = async function(instance, collection, data, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        const update = mongoose.model(collection);
        let condition = {};
        result = await update.updateMany(condition, data);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }

    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, undefined, undefined, data, COMMAND.DB_UPDATE, METHOD.UPDATE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.UPDATE_MANY = async function(instance, collection, condition, data, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        /*if(!condition){
            return result;
        }*/
        const update = mongoose.model(collection);
        result = await update.updateMany(condition, data);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, undefined, data, COMMAND.DB_UPDATE, METHOD.UPDATE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.UPDATE_ONE = async function(instance, collection, condition, data, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        /*if(!condition){
            return result;
        }*/
        const update = mongoose.model(collection);
        result = await update.updateOne(condition, data);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, undefined, data, COMMAND.DB_UPDATE, METHOD.UPDATE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.DELETE_ALL = async function(instance, collection, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        const del = mongoose.model(collection);
        let condition = {};
        result = await del.deleteMany(condition);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, undefined, undefined, undefined, COMMAND.DB_DELETE, METHOD.DELETE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.DELETE_MANY = async function(instance, collection, condition, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        /*if(!condition){
            return result;
        }*/
        const del = mongoose.model(collection);
        result = await del.deleteMany(condition);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, undefined, undefined, COMMAND.DB_DELETE, METHOD.DELETE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}

exports.DELETE_ONE = async function(instance, collection, condition, isWriteDetailLog) {
    let result;
    let reqTimeInMilliSec = Date.now();
    let inputResponse;
    try {
        /*if(!condition){
            return result;
        }*/
        const del = mongoose.model(collection);
        result = await del.deleteOne(condition);
        inputResponse = result;
    } catch (error) {
        inputResponse = error;
        result = {};
        result.err = error.message;
    }
    if(isWriteDetailLog === true){
        DB_LOG.call(this, instance, collection, condition, undefined, undefined, COMMAND.DB_DELETE, METHOD.DELETE, inputResponse, reqTimeInMilliSec);
    }
    return result;
}