const LOG = require('../../manager/log/log-manager');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postAuthenticateCustomer');
const sdfValidate = require('../../message/validate/sdf-validate');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const STATE = require('../../constants/fz-state');
const NODE = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const messageUtils = require('../../utils/message-utils');

module.exports = async function(req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.POST_LDAP;

    let postLdap = instance.postLdap;
    delete instance.postLdap;
    instance.currentState = STATE.W_LDAP_POST_LDAP;
    let resultCode;
    let resultDesc;
    let errMessageStacks;


        if(validator.isDefinedValue(postLdap)){
            resultCode = postLdap.resultCode;
            resultDesc = postLdap.resultDescription;
            errMessageStacks = postLdap.errorMessageStack;
        }
    

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validatePostLdapResponse(postLdap);
        LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_BAD);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, getGupGlobalServiceData.errorCode, getGupGlobalServiceData.errorMessage);
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_TIMEOUT);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, getGupGlobalServiceData.errorCode, getGupGlobalServiceData.errorMessage);
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_CONNECTION_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else{
            LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }
        return;
    }





    
}