const exception = require('../../exception/exceptions');
const FzCommand = require('../../constants/fz-client-command-name');
const validator = require('../../utils/validator');
const value = require('./response-validate');

exports.validatePostGenPartnerSpecificPrivateId = (postGenPartnerSpePrivateId) => {
    if(!validator.isDefinedValue(postGenPartnerSpePrivateId) === true){
        throw exception.systemError('Cannot response message');
    }
    value.validateResponseMethodPOST(postGenPartnerSpePrivateId, FzCommand.POST_GENERATEPARTNERSPECIFICPRIVATEID, true);
}
