
const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const pantryValidate = require('../../message/validate/aaf-validate');
const messageUtils = require('../../utils/message-utils');
const utils = require('./pushnoti-utils');

module.exports = async function(req, res, instance) {
    instance.currentState = STATE.IDLE;
    let pushnotificationInfoRequest = instance.pushnotificationInfoRequest;

    try {
        pantryValidate.validatePostPushNotification(pushnotificationInfoRequest);        
        LOG.STAT.call(this, STAT.AAF_RECEIVED_PUSH_NOTIFICATION_INFO_REQUEST);
    } catch (error) {
        //Validate Missing or Invalid
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        LOG.STAT.call(this, STAT.AAF_RECEIVED_BAD_PUSH_NOTIFICATION_INFO_REQUEST);
        utils.postPushNotificationInfoRespons.call(this, instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, error.message, STAT.AAF_RETURN_PUSH_NOTIFICATION_INFO_ERROR);
        return;
    }

    utils.replaceListOfServiceId(pushnotificationInfoRequest);
    utils.collapseListOfApp(pushnotificationInfoRequest);
    
}