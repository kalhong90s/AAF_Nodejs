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
    let commandName = COMMAND.POST_MODIFYIDENTITY;

    let postModifyGupSubResponse = instance.postModifyGupSubResponse;
    instance.currentState = STATE.W_POST_MODIFYIDENTITY_GUPSUBPROFILE;
    let data;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(postModifyGupSubResponse)){
        data = postModifyGupSubResponse.data;
        if(validator.isDefinedValue(data)){
            resultCode = data.resultCode;
            resultDesc = data.resultDescription;
            errMessageStacks = data.errorMessageStack;
        }else{
            resultCode = postModifyGupSubResponse.statusCode;
            resultDesc = postModifyGupSubResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validatePostModifyIdentityResponse(postModifyGupSubResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_BAD);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            instance.isPostModifyGupSub = false;
            await utils.mainProcessDelete.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            instance.isPostModifyGupSub = false;
            await utils.mainProcessDelete.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_ERROR);
            instance.isPostModifyGupSub = false;
            // utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            // await utils.mainProcessDelete.call(this, instance);
            // return;
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            instance.isPostModifyGupSub = false;
            await utils.mainProcessDelete.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_TIMEOUT);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            await utils.mainProcessDelete.call(this, instance);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_CONNECTION_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            instance.isPostModifyGupSub = false;
            await utils.mainProcessDelete.call(this, instance);
            return;
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_ERROR);
            await utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
            instance.isPostModifyGupSub = false;
            await utils.mainProcessDelete.call(this, instance);
            return;
        }
    }

    await utils.postGupSubProfile.call(this, instance);
    return;

}