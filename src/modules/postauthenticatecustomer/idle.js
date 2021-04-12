const LOG = require('../../manager/log/log-manager');
const pantryValidate = require('../../message/validate/aaf-validate');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const IDENTITYTYPE = require('../../constants/fz-identity-type');
const utils = require('./utility-postAuthenticateCustomer');
const STATE = require('../../constants/fz-state');
const parser = require('../../message/parser/request-parser');
const messageUtils = require('../../utils/message-utils');
const validator = require('../../utils/validator');
const globalService = require('../../utils/globalService');
const CONFIG = require('../../configurations/config');

module.exports = async function(req, res, instance) {
    let postAuthenticateCustomerRequest = parser(req);
    instance.currentState = STATE.IDLE;

    try {
        pantryValidate.validatePostAuthenticateCustomer(postAuthenticateCustomerRequest);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_POST_AUTHENTICATECUSTOMER_REQUEST);
    } catch (error) {
        //Validate Missing or Invalid
        LOG.STAT.call(this, STAT.AAF_RECEIVED_BAD_POST_AUTHENTICATECUSTOMER_REQUEST);
        utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, undefined, undefined);
        return;
    }

    instance.postAuthenticateCustomerRequest = postAuthenticateCustomerRequest;

    let isGetGupGlobalService = await globalService.haveToQueryGupGlobalService.call(this, instance, postAuthenticateCustomerRequest.appName);
    let serviceId;
    if(isGetGupGlobalService === false){
        LOG.DEBUG.DEBUG.call(this, `ServicId is ${serviceId}`);
        serviceId = instance.serviceId;
    }

    if(isGetGupGlobalService === true){
        //GET GupGlobalService
        await utils.getGupGlobalService.call(this, instance);
        return;
    }else{
        await utils.selectionAuthenticate.call(this, instance);
        return;
    }

}