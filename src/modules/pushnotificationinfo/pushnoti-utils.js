const validator = require('../../utils/validator');

postPushNotificationInfoResponsMessage = function (statusCode) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    return responseMessage;
}

exports.postPushNotificationInfoRespons = function (instance, res, statusCode, errorMsg, stat) {
    let responseMessage = postPushNotificationInfoResponsMessage(statusCode);
    res.errorMessage = errorMsg;
    res.status(statusCode.STATUS_CODE).send(responseMessage);
    LOG.STAT.call(this, stat);
    instance.nextState = STATE.END;
    instance.response = res;
}

exports.getSubscriptionIdValue = function(subscriptionId){
    if(validator.isDefinedValue(subscriptionId) === false)
        return undefined;
    return subscriptionId.split('\|');
}

exports.replaceListOfServiceId = function(pushNotificationInfoRequest) {
    let listOfServiceId = [];
    let serviceIdThatIsIntheList = [];

    let listOfApps = pushNotificationInfoRequest.listOfApp
    if(validator.isDefinedValue(listOfApps) === true){
        for(let list of Object.values(listOfApps)){
            let serviceId = list.serviceId;
            if(validator.isDefinedValue(serviceId) === false)
                continue;

            let serviceIdG = {}
            serviceIdG.serviceId = serviceId;
            if(serviceIdThatIsIntheList.includes(serviceId) === false){
                listOfServiceId.push(serviceIdG);
                serviceIdThatIsIntheList.push(serviceId);
            }
        }
    }
    if (listOfServiceId.length > 0) {
        pushNotificationInfoRequest.listOfServiceId = listOfServiceId;
    }
}

exports.collapseListOfApp = function(pushNotificationInfoRequest) {
    let listOfApps = pushNotificationInfoRequest.listOfApp
    if(!listOfApps){
        pushNotificationInfoRequest.listOfApp = [];
        return;
    }

    let listOfAppMapping = [];
    for(let listOfApp of Object.values(listOfApps)){
        if(listOfAppMapping[listOfApp.serviceId]){
            let listOfAppInMap = listOfAppMapping[listOfApp.serviceId];
            let appIds = listOfAppInMap.listOfAppId;
            if(!appIds){
                appIds = [];
                listOfAppInMap.listOfAppId = appIds;
            }
            listOfAppInMap.listOfAppId = addAllListOfAppIdWithoutDuplicate(appIds, listOfApp.listOfAppId);
            listOfAppMapping[listOfApp.serviceId] = listOfAppInMap;
        }else{
            listOfAppMapping[listOfApp.serviceId] = listOfApp;
        }
    }

    pushNotificationInfoRequest.listOfApp = Object.values(listOfAppMapping);
}

exports.addAllListOfAppIdWithoutDuplicate = function(sourceAppIds, toAddAppIds) {
    let buffAppIds = [];
    for(let appId of Object.values(toAddAppIds)){
        if(!containAppId(sourceAppIds, appId.appId)){
            sourceAppIds.push(appId);
        }
    }
    return sourceAppIds;
}

exports.containAppId = function(sourceAppIds, appId) {
    for(let val of Object.values(sourceAppIds)){
        if(validator.equalsValue(val.trim(), appId.trim()) === true){
            return true;
        }
    }
    return false;
}