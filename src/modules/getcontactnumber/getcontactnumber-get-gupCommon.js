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
const utils = require('./getcontactnumber-utils');

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
            utils.getContactNumberResponse.call(this, instance, res, STATUS.SYSTEM_ERROR,undefined, errorMessageStack, errorMessageStacks, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else if(error.event === EXCEPTION_EVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getContactNumberResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, undefined, errorMessageStack, errorMessageStacks, undefined, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else if(error.event === EXCEPTION_EVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, req, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getContactNumberResponse.call(this, instance, res, STATUS.SYSTEM_ERROR,undefined, errorMessageStack, errorMessageStacks, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else if(error.event === EXCEPTION_EVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, response.errorCode, response.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT);
            utils.getContactNumberResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, undefined, undefined, undefined, undefined, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else if(error.event === EXCEPTION_EVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, response.errorCode, response.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getContactNumberResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, undefined, undefined, undefined, undefined, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else{
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.getContactNumberResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }
        return;
    }

    let idValue = instance.getContactNumberRequest.idValue;
    let ContactNumber = undefined;    

    try {
        if(gupCommon.gupImpi){
            for(let data of gupCommon.gupImpi){
                LOG.DEBUG.DEBUG.call(this, instance, ` -- Compare idValue=${idValue} : privateId=${data.privateId}`);
                if(idValue == data.privateId){
                    ContactNumber = data.msisdn;
                    LOG.DEBUG.DEBUG.call(this, instance, ` -- Data is match : true`);
                    LOG.DEBUG.DEBUG.call(this, instance, ` ------------------------`);
                    break;
                }
                LOG.DEBUG.DEBUG.call(this, instance, ` -- Data is match : false`);
                LOG.DEBUG.DEBUG.call(this, instance, ` ------------------------`);


            }
        }    

        LOG.DEBUG.DEBUG.call(this, instance, ` -- ContactNumber : ${ContactNumber}`);

        if(!validator.isDefinedValue(ContactNumber)){
            LOG.DEBUG.DEBUG.call(this, instance, 'Not Found ContactNumber');
            throw exception.dataNotFound('Not Found ContactNumber');
        }        
        utils.getContactNumberResponse.call(this, instance, res, STATUS.SUCCESS,ContactNumber, undefined, undefined, undefined, STAT.AAF_RETURN_GET_CONTACTNUMBER_SUCCESS);

        return;
    } catch (error) {
        if(error.event === EXCEPTION_EVENT.DATA_NOT_FOUND){
            utils.getContactNumberResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, undefined, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }else{
            utils.getContactNumberResponse.call(this, instance, res, STATUS.SYSTEM_ERROR,  undefined,undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
        }
    }


}