const LOG = require('../../manager/log/log-manager');
const NODE = require('../../constants/fz-node-name');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const EXCEPTION_EVENT = require('../../constants/fz-exception-event');
const COMMAND = require('../../constants/fz-client-command-name');
const sdfValidate = require('../../message/validate/sdf-validate');
const messageUtils = require('../../utils/message-utils');
const validator = require('../../utils/validator');
const exception = require('../../exception/exceptions'); 

const utils = require('./get-privateid-utils');

module.exports = async function(req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_GUPCOMMON;
    
    let response = instance.getGupCommonResponse;
    instance.currentState = STATE.W_GET_GUPCOMMON;
    let gupCommon;
    let resultCode;
    let resultDesc;
    let errorMessageStacks;

    if(validator.isDefinedValue(response)){
        gupCommon = response.data;
        if(validator.isDefinedValue(gupCommon)){
            resultCode = gupCommon.resultCode;
            resultDesc = gupCommon.resultDescription;
            errorMessageStacks = gupCommon.errorMessageStack;
        }
    }
    
    try{
        sdfValidate.validateGetGupCommonResponse(response);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        let errorMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc);
        if(error.event === EXCEPTION_EVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_BAD);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, undefined, errorMessageStack, errorMessageStacks, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else if(error.event === EXCEPTION_EVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, undefined, errorMessageStack, errorMessageStacks, undefined, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else if(error.event === EXCEPTION_EVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, req, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, undefined, errorMessageStack, errorMessageStacks, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else if(error.event === EXCEPTION_EVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, response.errorCode, response.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, undefined, undefined, undefined, undefined, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else if(error.event === EXCEPTION_EVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, response.errorCode, response.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, undefined, undefined, undefined, undefined, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else{
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }
        return;
    }

    let getPrivateIdRequest = instance.getPrivateIdRequest;
    try {
        let publicId = getPrivateIdRequest.publicId;
        let privateIds;
        if(validator.isMsisdn(publicId) === true){
            //MSISDN
            let gupSubProfiles = gupCommon.gupSubProfile;
            let gupSubProfile = utils.getGupSubProfile(publicId, gupSubProfiles);
            if(!gupSubProfile){
                throw exception.dataNotFound('Not Found GupSubProfile');
            }
            privateIds = gupSubProfile.privateIds;
        }else{
            //PUBLICID
            let gupImpus = gupCommon.gupImpu;
            let gupImpu = utils.getGupImpu(publicId, gupImpus);
            if(!gupImpu){
                throw exception.dataNotFound('Not Found GupImpu');
            }
            privateIds = gupImpu.privateIds;
        }
        
        if(validator.isDefinedValue(privateIds) === false){
            throw exception.dataNotFound('Not Found PrivateId');
        }
        let gupImpis = gupCommon.gupImpi;
        let gupImpi = utils.getGupImpi(publicId, privateIds[0], gupImpis);
        if(!gupImpi){
            throw exception.dataNotFound('Not Found GupImpi');
        }
        let listOfPrivateId = [{
            privateId : privateIds[0]
        }];
        utils.getPrivateIdResponse.call(this, instance, res, STATUS.SUCCESS, listOfPrivateId, undefined, undefined, undefined, STAT.AAF_RETURN_GET_PRIVATEID_RESPONSE);
        return;
    } catch (error) {
        if(error.event === EXCEPTION_EVENT.DATA_NOT_FOUND){
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }else{
            utils.getPrivateIdResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        }
    }
}