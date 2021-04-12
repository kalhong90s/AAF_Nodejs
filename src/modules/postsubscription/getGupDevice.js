const LOG = require('../../manager/log/log-manager');
const NODE = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const validator = require('../../utils/validator');
const sdfValidate = require('../../message/validate/sdf-validate');
const exception = require('../../constants/fz-exception-event');
const utils = require('./utility-postSubscription');
const messageUtils = require('../../utils/message-utils');

module.exports = async function(req, res, instance) {
    instance.currentState = STATE.W_GET_GUPDEVICE;
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_GUPDEVICE;
    let getGupDeviceResponse = instance.getGupDeviceResponse;
    delete instance.getGupDeviceResponse;
    
    let getGupDevice;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getGupDeviceResponse)){
        getGupDevice = getGupDeviceResponse.data;
        if(validator.isDefinedValue(getGupDevice)){
            resultCode = getGupDevice.resultCode;
            resultDesc = getGupDevice.resultDescription;
            errMessageStacks = getGupDevice.errMessageStack;
        }else{
            resultCode = getGupDeviceResponse.statusCode;
            resultDesc = getGupDeviceResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validateGupDeviceResponse(getGupDeviceResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RESPONSE);
    }catch(error){
        
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        
        if(error.event === exception.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_BAD);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === exception.DATA_NOT_FOUND){
            //LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR);
            LOG.DEBUG.DEBUG.call(this, instance, 'Not found gupDevice --> continue process');
            errMessageStack = undefined;
            //continue...
        }else if(error.event === exception.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === exception.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === exception.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_TIMEOUT);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === exception.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }
    }

    instance.gupDevice = getGupDevice;
    let postSubscriptionsRequest = instance.postSubscriptionsRequest;
    let idType = postSubscriptionsRequest.idType;
    let idValue = postSubscriptionsRequest.idValue;
    let appName = postSubscriptionsRequest.appName;
    let cspName = postSubscriptionsRequest.cspName;

    if(STATUS.SUCCESS.RESULT_CODE == resultCode ){
        let isSameUid = utils.validateDeviceOwner.call(this, instance, instance.uid, getGupDevice);
        if(isSameUid === false){
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, `found gupDevice uid different public`, undefined , errMessageStacks)
            return;
        }else{
            instance.isCreateDevice = false;
        }
    }else{
        instance.isCreateDevice = true;
    }
    
    //Case Not Found
    let getGupCommonData = instance.getGupCommonResponse.data;
    gupCommonResultCode = getGupCommonData.resultCode;
    gupCommonResultDesc = getGupCommonData.resultDescription;
    errMessageStacks = getGupCommonData.errorMessageStack;
    errMessageStack = messageUtils.errorMessageStack(nodeName, gupCommonResultCode, gupCommonResultDesc)

    await utils.mainProcessGupCommon.call(this, instance, res, idType, idValue, cspName, appName, gupCommonResultCode, errMessageStack, errMessageStacks);
    return;
}