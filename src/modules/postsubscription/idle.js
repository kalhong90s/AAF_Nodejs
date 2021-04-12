const LOG = require('../../manager/log/log-manager');
const pantryValidate = require('../../message/validate/aaf-validate');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const IDENTITYTYPE = require('../../constants/fz-identity-type');
const utils = require('./utility-postSubscription');
const STATE = require('../../constants/fz-state');
const parser = require('../../message/parser/request-parser');
const messageUtils = require('../../utils/message-utils');
const validator = require('../../utils/validator');
const globalService = require('../../utils/globalService');

module.exports = async function(req, res, instance) {
    let postSubscriptionsRequest = parser(req);
    instance.currentState = STATE.IDLE;
    instance.postSubscriptionsRequest = postSubscriptionsRequest;
    instance.idValueForDelete = postSubscriptionsRequest.idValue;
    let callAgain = await utils.isOrderStillInProcessing.call(this, instance, postSubscriptionsRequest.idValue);
    if(callAgain === true){
        LOG.STAT.call(this, STAT.AAF_RECEIVED_POST_SUBSCRIPTION_REQUEST);
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.ORDER_STILL_IN_PROCESSING, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, "Application still process", undefined, undefined);
        return;
    }else{
        let createSuccess = await utils.createInfoToDB.call(this, instance, postSubscriptionsRequest.idValue);
        if(createSuccess === false){
            LOG.STAT.call(this, STAT.AAF_RECEIVED_POST_SUBSCRIPTION_REQUEST);
            if(instance.mongoError){
                utils.postSubscriptionsResponse.call(this, instance, res, STATUS.ORDER_STILL_IN_PROCESSING, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, "Can not insert to mongoDB", undefined,  undefined);
                return;
            }else{
                utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, "Can not insert to mongoDB", undefined,  undefined);
                return;
            }
        }
    }

    try {
        pantryValidate.validatePostSubscriptions(postSubscriptionsRequest);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_POST_SUBSCRIPTION_REQUEST);
    } catch (error) {
        //Validate Missing or Invalid
        LOG.DEBUG.DEBUG.call(this,instance, `Error : ${error.message}`);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_BAD_POST_SUBSCRIPTION_REQUEST);
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, undefined,  undefined);
        return;
    }

    let idValue = postSubscriptionsRequest.idValue;
    let idType = postSubscriptionsRequest.idType;
    let cspName = postSubscriptionsRequest.cspName;
    if(validator.equalsValue(idType, IDENTITYTYPE.EMAIL)){
        if(messageUtils.checkAppNameAddSuffix(postSubscriptionsRequest.appName)){
            idValue = messageUtils.convertPublicIdToAppNameDomainFormat(idValue, postSubscriptionsRequest.appName);
        }
        idValue = messageUtils.convertPublicIdToProtocolFormat(idValue);
    }
    postSubscriptionsRequest.idValue = idValue;

    if(!validator.isDefinedValue(cspName)){
        postSubscriptionsRequest.cspName = "other";
    }

    instance.postSubscriptionsRequest = postSubscriptionsRequest;
    let isGetGupGlobalService = await globalService.haveToQueryGupGlobalService.call(this, instance, postSubscriptionsRequest.appName);
    let serviceId;
    if(isGetGupGlobalService === false){
        serviceId = instance.serviceId;
    }

    if(isGetGupGlobalService === true){
        //GET GupGlobalService
        await utils.getGupGlobalService.call(this, instance);
        return;
    }else{
        //GET GupCommon
        LOG.DEBUG.DEBUG.call(this, `ServicId is ${serviceId}`);
        await utils.getGupCommon.call(this, instance, postSubscriptionsRequest.idValue);
        return;
    }
}