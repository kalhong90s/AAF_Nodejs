
const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const parser = require('../../message/parser/request-parser');
const pantryValidate = require('../../message/validate/aaf-validate');
const messageUtils = require('../../utils/message-utils');
const utils = require('./getcontactnumber-utils');

module.exports = async function(req, res, instance) {

    let getContactNumberRequest = parser(req);
    instance.getContactNumberRequest = getContactNumberRequest;
    let idValue = getContactNumberRequest.idValue;
    instance.currentState = STATE.IDLE;    
    LOG.DEBUG.DEBUG.call(this, instance, `idType : ${getContactNumberRequest.idType}`);
    LOG.DEBUG.DEBUG.call(this, instance, `idvalue : ${idValue}`);
    LOG.DEBUG.DEBUG.call(this, instance, `commandId : ${getContactNumberRequest.commandId}`);

    try {
        if(idValue){
            idValue = utils.checkDomain(idValue);
            getContactNumberRequest.idValue = idValue;
        }    
        
        pantryValidate.validateGetContactNumber(getContactNumberRequest);               
        LOG.STAT.call(this, STAT.AAF_RECEIVED_GET_PUBLICLIST_REQUEST);
    } catch (error) {
        //Validate Missing or Invalid
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_BAD_GET_CONTACTNUMBER_REQUEST);
        utils.getContactNumberResponse.call(this, instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PUBLICLIST_ERROR);
        return;
    }

    await utils.getGupCommon.call(this, instance, idValue);

};