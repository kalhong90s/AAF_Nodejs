const exception = require('../../exception/exceptions');
const FzCommand = require('../../constants/fz-client-command-name');
const validator = require('../../utils/validator');
const messageUtils = require('../../utils/message-utils');
const value = require('./response-validate');

exports.validatePostLdapResponse = (postLdap) => {
    if(validator.isDefinedValue(postLdap) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponseMethodPOST(postLdap, FzCommand.POST_IDENTITYSERVICE, false);
}

