const exception = require('../../exception/exceptions');
const FzCommand = require('../../constants/fz-client-command-name');
const validator = require('../../utils/validator');
const messageUtils = require('../../utils/message-utils');
const value = require('./response-validate');

exports.validatePostIdentityServiceResponse = (postThirdPartyResponse) => {
    if(validator.isDefinedValue(postThirdPartyResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponseMethodPOST(postThirdPartyResponse, FzCommand.POST_IDENTITYSERVICE, false);
}

exports.validateGetCustomerProfileResponse = (getCustomweProfileResponse) => {
    if(validator.isDefinedValue(postThirdPartyResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponseMethodPOST(postThirdPartyResponse, FzCommand.POST_IDENTITYSERVICE, false);
}