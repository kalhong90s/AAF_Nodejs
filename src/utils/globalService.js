const CONFIG = require('../configurations/config');
const DB = require('../message/builder/db-builder');
const LOG = require('../manager/log/log-manager');
const validator  = require('./validator');
let insertAlready = false;

exports.manangeServiceId = async function(instance, getGupGlobalServiceResponse) {
    let gupGlobalResponse = getGupGlobalServiceResponse.data ? getGupGlobalServiceResponse.data.gupGlobalService : getGupGlobalServiceResponse.gupGlobalService;
    let serviceList = [];
    if(validator.isDefinedValue(gupGlobalResponse)){
        for(let service of gupGlobalResponse){
            if(!validator.isDefinedValue(service.serviceId) || !validator.isDefinedValue(service.gupServiceName)){
                continue;
            }
            serviceList.push(service);
        }
    }

    if (insertAlready === true) {
        await DB.UPDATE_SERVICES.call(this, instance, serviceList);
    } else {
        let response = await DB.INSERT_SERVICES.call(this, instance, serviceList);
        if(response){
            if(response.id){
                insertAlready = true;
            }
        }
    }
}

exports.getServiceIdByAppName = async function(instance, appName, getGupGlobalServiceResponse) {
    if(!appName){
        return undefined;
    }
    try {
        if(getGupGlobalServiceResponse){
            /*{
                "gupGlobalService":[
                    {
                        "dn":"serviceId=1231,o=service,o=gup,o=nss,o=services,o=AIS,dc=C-NTDB",
                        "serviceId":"1231",
                        "objectClass":" gupGlobalService ",
                        "gupServiceName":"STB"
                    },
                    {
                        "dn":"serviceId=1232,o=service,o=gup,o=nss,o=services,o=AIS,dc=C-NTDB",
                        "serviceId":"1232",
                        "objectClass":" gupGlobalService ",
                        "gupServiceName":"FBB"
                    }
                ]
            }*/
            let serviceList = getGupGlobalServiceResponse.data ? getGupGlobalServiceResponse.data.gupGlobalService : getGupGlobalServiceResponse.gupGlobalService;
            for(let object of serviceList){
                if (object.gupServiceName === appName) {
                    return object.serviceId;
                }
            }
        }else{
            let data = await DB.READ_SERVICES.call(this, instance);
            if(data){
                let services = data.services;
                if (services) {
                    for (let service of services) {
                        if (service.gupServiceName === appName) {
                            return service.serviceId;
                        }
                    }
                }
            }
        }   
    } catch (error) {
        
    }
    return undefined;
}

exports.getServiceNameByServiceId = async function(instance, serviceId, getGupGlobalServiceResponse) {
    if(!serviceId){
        return undefined;
    }
    try {
        if(getGupGlobalServiceResponse){
            let serviceList = getGupGlobalServiceResponse.data ? getGupGlobalServiceResponse.data.gupGlobalService : getGupGlobalServiceResponse.gupGlobalService;
            for(let object of serviceList){
                if (object.serviceId === serviceId) {
                    return object.gupServiceName;
                }
            }
        }else{
            let data = await DB.READ_SERVICES.call(this, instance);
            if(data){
                let services = data.services;
                if (services) {
                    for (let service of services) {
                        if (service.serviceId === serviceId) {
                            return service.gupServiceName;
                        }
                    }
                }
            }
        }
    } catch (error) {
        
    }
    return undefined;
}

exports.haveToQueryGupGlobalService = async function(instance, appName) {
    let data = await DB.READ_SERVICES.call(this, instance);
    let alreadyPassedTime = await alreadyPassedTimeFromConfiguration(data);
    let alreadyHaveService = await alreadyHaveServiceInMongo(instance, data, appName);
    LOG.DEBUG.DEBUG.call(this,instance, `alreadyPassedTime : ${alreadyPassedTime}`);
    LOG.DEBUG.DEBUG.call(this,instance, `alreadyHaveService : ${alreadyHaveService}`);
    if (!alreadyHaveService || alreadyPassedTime === true) {
        LOG.DEBUG.DEBUG.call(this,instance, `result : update service`);
        return true;
    }
    LOG.DEBUG.DEBUG.call(this,instance, `result : don't update service`);
    return false;
}

alreadyPassedTimeFromConfiguration = async function(readMongo) {
    let start = Date.now();
    let timeConfigMin = CONFIG.RE_GETGUPGLOBALSERVICE;
    let timeConfigMil = timeConfigMin * 60000;
    if (timeStamp = readMongo) {
        let timeInsertdb = timeStamp.lastupdate;
        start -= timeInsertdb;
        if (start < 0) {
            start = 0;
        }
        return start >= timeConfigMil;
    }
    return false;
}

alreadyHaveServiceInMongo = async function(instance, readMongo, appName) {
    insertAlready = false;
    if (null !== readMongo) {
        insertAlready = true;
        let services = readMongo.services;
        if (services) {
            for (let service of services) {
                if (service.gupServiceName === appName) {
                    instance.serviceId = service.serviceId;
                    return true;
                }
            }
        }
    }
    return false;
}