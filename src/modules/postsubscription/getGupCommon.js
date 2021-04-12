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
const messageUtils = require('../../utils/message-utils');
const CODER = require('../../utils/coder');
const IDENTITYTYPE = require('../../constants/fz-identity-type');

module.exports = async function(req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_GUPCOMMON;

    let getGupCommonResponse = instance.getGupCommonResponse;
    // delete instance.getGupCommonResponse;
    instance.currentState = STATE.W_GET_GUPCOMMON;
    let getGupCommonData;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getGupCommonResponse)){
        getGupCommonData = getGupCommonResponse.data;
        if(validator.isDefinedValue(getGupCommonData)){
            resultCode = getGupCommonData.resultCode;
            resultDesc = getGupCommonData.resultDescription;
            errMessageStacks = getGupCommonData.errorMessageStack;
        }else{
            resultCode = getGupCommonResponse.statusCode;
            resultDesc = getGupCommonResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validateGetGupCommonResponse(getGupCommonResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_BAD);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            LOG.DEBUG.DEBUG.call(this, instance, 'Not found gupCommon --> continue process');
            // return;
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_CONNECTION_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            return;
        }
    }

    let postSubscriptionsRequest = instance.postSubscriptionsRequest;
    let deviceId = postSubscriptionsRequest.deviceId;
    let idType = postSubscriptionsRequest.idType;
    let idValue = postSubscriptionsRequest.idValue;
    let appName = postSubscriptionsRequest.appName;
    let cspName = postSubscriptionsRequest.cspName;

    if(validator.isDefinedValue(deviceId)){
        deviceId = CODER.decodeBase64(deviceId);
        postSubscriptionsRequest.deviceId = deviceId;
        instance.postSubscriptionsRequest = postSubscriptionsRequest;
        utils.getUid(instance, idValue);
        await utils.getStbManageDeviceProfile.call(this, instance, deviceId);
        return;
    }else{
        await utils.mainProcessGupCommon.call(this, instance, res, idType, idValue, cspName, appName, resultCode, errMessageStack, errMessageStacks);
        return;
    }
}