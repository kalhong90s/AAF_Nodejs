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
    let commandName = COMMAND.GET_GUPCOMMON;

    let getGupCommonResponseByPrivate = instance.getGupCommonResponseByPrivate;
    instance.currentState = STATE.W_GET_GUPCOMMON_BY_PRIVATEID;
    let getGupCommonData;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getGupCommonResponseByPrivate)){
        getGupCommonData = getGupCommonResponseByPrivate.data;
        if(validator.isDefinedValue(getGupCommonData)){
            resultCode = getGupCommonData.resultCode;
            resultDesc = getGupCommonData.resultDescription;
            errMessageStacks = getGupCommonData.errorMessageStack;
        }else{
            resultCode = getGupCommonResponseByPrivate.statusCode;
            resultDesc = getGupCommonResponseByPrivate.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validateGetGupCommonResponse(getGupCommonResponseByPrivate);
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
    let idValue = postSubscriptionsRequest.idValue;

    let data = instance.getGupCommonResponse.data;
    gupCommonResultCode = data.resultCode;

    if(STATUS.SUCCESS.RESULT_CODE === gupCommonResultCode){
        utils.getUid(instance, idValue);
        if(STATUS.SUCCESS.RESULT_CODE === resultCode){
            //found & found must match uid
            if(!utils.isSameUid.call(this,instance)){
                utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'uid is not match', errMessageStack , errMessageStacks)
                return;
            }
        }
        //found & not found
        utils.checkDataForPost.call(this, instance, res, idValue);
        await utils.mainProcessPost.call(this, instance, res);
        return;

    }else if(STATUS.DATA_NOT_FOUND.RESULT_CODE === gupCommonResultCode && STATUS.SUCCESS.RESULT_CODE === resultCode){
        //not found & found
        utils.getUidFromPrivate(instance,instance.convertPrivate);
        utils.checkDataForPost.call(this, instance, res, idValue);
        if(!validator.isDefinedValue(instance.uid)){
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'cannot find uid from gupCommon(privateId)', undefined , undefined)
            return;
        }
        await utils.mainProcessPost.call(this, instance, res);
        return;

    }else{
        //not found & not found
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'case not found/not found', undefined , undefined)
        return;
    }

}