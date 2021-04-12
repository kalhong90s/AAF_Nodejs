const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postAuthenticateCustomer');
const parser = require('../../message/parser/request-parser');
const idle = require('./idle');
const getGupGlobalService = require('./getGupGlobalService');
const getGupCommon = require('./getGupcommon');
const getCustomerProfile = require('./getCustomerProfile');
const postIdentityService = require('./postIdentityService');
const postLdap = require('./postLdap');
const postThirdParty = require('./postThirdParty');

module.exports.postAuthenticateCustomerController = async function(req, res){
    let instance = req.instance; //get instance
    let command = require('../../constants/fz-aaf-command-name').POST_AUTHENTICATECUSTOMER;
    let node = require('../../constants/fz-node-name').AAF;
    let continueProcess = true;

    instance.cmd = command; //set command

    try {
        let postAuthenticateCustomerRequest = parser(req);

        idValue = postAuthenticateCustomerRequest.idValue ? postAuthenticateCustomerRequest.idValue : '';
        LOG.INIT.call(this, req, instance.initInvoke, node, command, idValue);

        let state = STATE.IDLE;
        while(continueProcess){
            LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${state}] ####################`);
            if(state === STATE.IDLE){
                await idle.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPGLOBALSERVICE){
                await getGupGlobalService.call(this, req, res, instance);
            }else if(state === STATE.W_THIRDPARTY_POST_THIRDPARTY){
                await postThirdParty.call(this, req, res, instance);
            }else if(state === STATE.W_SSO_IDS_POST_IDENTITYSERVICE){
                await postIdentityService.call(this, req, res, instance);
            }else if(state === STATE.W_SSO_IDS_GET_CUSTOMERPROFILE){
                await getCustomerProfile.call(this, req, res, instance);
            }else if(state === STATE.W_LDAP_POST_LDAP){
                await postLdap.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPCOMMON){
                await getGupCommon.call(this, req, res, instance);
            }else{
                continueProcess = false;
                break;
            }
            
            state = instance.nextState;
            instance.nextState = STATE.END;
        }
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this,instance, `[APPLICATION:ERROR] : ${error.message}`);
        LOG.DEBUG.ERROR.call(this,instance, `[APPLICATION:ERROR] : ${error.message}`);
        utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR,undefined, undefined, error.message, undefined,undefined);
    }
}