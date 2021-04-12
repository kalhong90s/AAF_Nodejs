const LOG = require('../../manager/log/log-manager');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postSubscription');
const sdfValidate = require('../../message/validate/sdf-validate');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const STATE = require('../../constants/fz-state');
const NODE = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const globalService = require('../../utils/globalService');
const messageUtils = require('../../utils/message-utils');

module.exports = async function(req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_GUPGLOBALSERVICE;

    let getGupGlobalServiceResponse = instance.getGupGlobalServiceResponse;
    instance.currentState = STATE.W_GET_GUPGLOBALSERVICE;
    let getGupGlobalServiceData;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getGupGlobalServiceResponse)){
        getGupGlobalServiceData = getGupGlobalServiceResponse.data;
        if(validator.isDefinedValue(getGupGlobalServiceData)){
            resultCode = getGupGlobalServiceData.resultCode;
            resultDesc = getGupGlobalServiceData.resultDescription;
            errMessageStacks = getGupGlobalServiceData.errorMessageStack;
        }else{
            resultCode = getGupGlobalServiceResponse.statusCode;
            resultDesc = getGupGlobalServiceResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validateGetGupGlobalServiceResponse(getGupGlobalServiceResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RESPONSE);
        await globalService.manangeServiceId.call(this, instance, getGupGlobalServiceResponse);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_BAD);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_TIMEOUT);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_CONNECTION_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }
        return;
    }

    let serviceId = await globalService.getServiceIdByAppName(instance, instance.postSubscriptionsRequest.appName, getGupGlobalServiceResponse);
    LOG.DEBUG.DEBUG.call(this, instance, `ServicId is ${serviceId}`);
    if(validator.isDefinedValue(serviceId) === false){
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, `Not found service ${instance.postSubscriptionsRequest.appName}`, undefined , undefined)
        return;
    }else{
        instance.serviceId = serviceId;
        await utils.getGupCommon.call(this, instance, instance.postSubscriptionsRequest.idValue);
        return;
    }
}