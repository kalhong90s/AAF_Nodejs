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

module.exports = async function(req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.POST_GUPDEVICE;

    let postGupDeviceResponse = instance.postGupDeviceResponse;
    instance.currentState = STATE.W_POST_GUPDEVICE;
    let data;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(postGupDeviceResponse)){
        data = postGupDeviceResponse.data;
        if(validator.isDefinedValue(data)){
            resultCode = data.resultCode;
            resultDesc = data.resultDescription;
            errMessageStacks = data.errorMessageStack;
        }else{
            resultCode = postGupDeviceResponse.statusCode;
            resultDesc = postGupDeviceResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validatePostModifyIdentityResponse(postGupDeviceResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_BAD);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_TIMEOUT);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteGupDevice.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_CONNECTION_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.deleteModifyIdentityGupDevice.call(this, instance);
            return;
        }
    }

    let listOfService = await utils.getServiceList(instance);

    if(instance.isNewInsertSub || !instance.isPostGupServiceElement){
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CREATE_SUCCESS, STAT.AAF_RETURN_POST_SUBSCRIPTION_RESPONSE, instance.privateId, listOfService, undefined, undefined , undefined)
        return;
    }else{
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SUCCESS, STAT.AAF_RETURN_POST_SUBSCRIPTION_RESPONSE, instance.privateId, listOfService, undefined, undefined , undefined)
        return;
    }

}