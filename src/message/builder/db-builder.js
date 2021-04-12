const DB = require('../../service/mongodb/db-service');
const COLLECTION = require('../../constants/fz-db-collection-name');
const STAT = require('../../constants/fz-stat');
const LOG = require('../../manager/log/log-manager');

this.serviceList_id = ''

exports.READ_SERVICES = async function(instance) {
    let response;
    LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SERVICE_REQUEST);
    if(this.serviceList_id){
        response = await DB.READ_ONE.call(this, instance, COLLECTION.SERVICE, {_id : this.serviceList_id}, undefined, true);
    }else{
        response = await DB.READ_FIRST.call(this, instance, COLLECTION.SERVICE, undefined, true);
        if(response){
            if(response.id){
                this.serviceList_id = response.id;
            }
        }
    }
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SERVICE_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SERVICE_RESPONSE_ERROR);
    }
    return response;
}

exports.INSERT_SERVICES = async function(instance, gupGlobalServiceResponse) {
    let serviceInsert = {
        lastupdate : Date.now(),
        services : gupGlobalServiceResponse
    }

    LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SERVICE_REQUEST);
    let response = await DB.INSERT.call(this, instance, COLLECTION.SERVICE, serviceInsert, true);
    if(response == null || !response.err){
        this.serviceList_id = response.id;
        LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SERVICE_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SERVICE_RESPONSE_ERROR);
    }
    return response;
}

exports.UPDATE_SERVICES = async function(instance, gupGlobalServiceResponse) {
    let data = {
        $set: {
            lastupdate: Date.now(),
            services : gupGlobalServiceResponse
        }
    }
    LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SERVICE_REQUEST);
    let response = await DB.UPDATE_ONE.call(this, instance, COLLECTION.SERVICE, {_id : this.serviceList_id}, data, true);
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SERVICE_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SERVICE_RESPONSE_ERROR);
    }
    return response;
}

exports.READ_POSTSUBSCRIPTIONS = async function(instance, publicId){
    let condiftion = {
        publicId : publicId
    }
    LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SUBSCRIPTION_REQUEST);
    let response = await DB.READ_MANY.call(this, instance, COLLECTION.SUBSCRIPTION, condiftion, undefined, true);
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SUBSCRIPTION_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_READ_SUBSCRIPTION_RESPONSE_ERROR);
    }
    return response;
}

exports.INSERT_POSTSUBSCRIPTIONS = async function(instance, publicId){
    let timestamp = Date.now();
    let data = { timestamp : timestamp, publicId : publicId };
    LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SUBSCRIPTION_REQUEST);
    let response = await DB.INSERT.call(this, instance, COLLECTION.SUBSCRIPTION, data, true);
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SUBSCRIPTION_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_INSERT_SUBSCRIPTION_RESPONSE_ERROR);
    }
    return response;
}

exports.DELETE_POSTSUBSCRIPTIONS = async function(instance, publicId){
    let condiftion = {
        publicId : publicId
    }
    LOG.STAT.call(this, STAT.AAF_MONGODB_DELETE_SUBSCRIPTION_REQUEST);
    let response = await DB.DELETE_MANY.call(this, instance, COLLECTION.SUBSCRIPTION, condiftion, true);
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_DELETE_SUBSCRIPTION_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_DELETE_SUBSCRIPTION_RESPONSE_ERROR);
    }
    return response;
}

exports.UPDATE_POSTSUBSCRIPTIONS = async function(instance, publicId) {
    let condiftion = {
        publicId : publicId
    }
    let timestamp = Date.now();
    let data = { timestamp : timestamp};
    LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SUBSCRIPTION_REQUEST);
    let response = await DB.UPDATE_MANY.call(this, instance, COLLECTION.SUBSCRIPTION, condiftion, data, true);
    if(response == null || !response.err){
        LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SUBSCRIPTION_RESPONSE);
    }else{
        LOG.STAT.call(this, STAT.AAF_MONGODB_UPDATE_SUBSCRIPTION_RESPONSE_ERROR);
    }
    return response;
}