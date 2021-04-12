const LOG = require('../../manager/log/log-manager');
const STAT = require('../../constants/fz-stat');
const dsmpValidate = require('../../message/validate/dsmp-validate');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const STATE = require('../../constants/fz-state');

module.exports = async function(req, res, instance) {

    let deleteSubscriberResponse = instance.deleteSubscriberResponse;
    instance.currentState = STATE.W_DELETE_SUBSCRIBER;
    let data;

    if(validator.isDefinedValue(deleteSubscriberResponse)){
        data = deleteSubscriberResponse.data;
        if(validator.isDefinedValue(data)){
            resultCode = data.resultCode;
            resultDesc = data.developerMessage;
            errMessageStacks = data.errorMessageStack;
        }
    }

    try{
        dsmpValidate.validateDeleteSubscriberResponse(deleteSubscriberResponse);
        LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_BAD);
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_ERROR);
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_ERROR);
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_ERROR);
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_TIMEOUT);
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_CONNECTION_ERROR);
        }else{
            LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_ERROR);
        }
    }

    return;

}