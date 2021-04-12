
const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const parser = require('../../message/parser/request-parser');
const pantryValidate = require('../../message/validate/aaf-validate');
const messageUtils = require('../../utils/message-utils');

const utils = require('./get-privateid-utils');

module.exports = async function(req, res, instance) {
    let getPrivateIdRequest = parser(req);
    instance.getPrivateIdRequest = getPrivateIdRequest;
    let publicId = '';

    instance.currentState = STATE.IDLE;

    try {
        publicId = getPrivateIdRequest.publicId;
        pantryValidate.validateGetPrivateId(getPrivateIdRequest);               
        LOG.STAT.call(this, STAT.AAF_RECEIVED_GET_PRIVATEID_REQUEST);
    } catch (error) {
        //Validate Missing or Invalid
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_GET_PRIVATEID_BAD_REQUEST);
        utils.getPrivateIdResponse.call(this, instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
        return;
    }
    
    publicId = messageUtils.convertPublicIdToProtocolFormat(publicId);
    instance.getPrivateIdRequest.publicId = publicId;
    await utils.getGupCommon.call(this, instance, publicId);
}