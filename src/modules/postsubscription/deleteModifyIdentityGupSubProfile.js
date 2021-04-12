const LOG = require('../../manager/log/log-manager');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postSubscription');
const sdfValidate = require('../../message/validate/sdf-validate');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const STATE = require('../../constants/fz-state');

module.exports = async function(req, res, instance) {

    let deleteModifyGupSubResponse = instance.deleteModifyGupSubResponse;
    instance.currentState = STATE.W_DELETE_MODIFYIDENTITY_GUPDEVICE;
    let data;

    if(validator.isDefinedValue(deleteModifyGupSubResponse)){
        data = deleteModifyGupSubResponse.data;
        if(validator.isDefinedValue(data)){
            resultCode = data.resultCode;
            resultDesc = data.resultDescription;
            errMessageStacks = data.errorMessageStack;
        }
    }

    try{
        sdfValidate.validatePostModifyIdentityResponse(deleteModifyGupSubResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_BAD);
            return;
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_ERROR);
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_ERROR);
            return;
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_ERROR);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_TIMEOUT);
            return;
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_CONNECTION_ERROR);
            return;
        }else{
            LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_ERROR);
            return;
        }
    }

    await utils.mainProcessDelete.call(this, instance);
    return;

}