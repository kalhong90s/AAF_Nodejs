const exception = require('../../exception/exceptions');
const FzCommand = require('../../constants/fz-client-command-name');
const validator = require('../../utils/validator');
const value = require('./response-validate');

exports.validatePostSubscriberResponse = (postSubscriberResponse) => {
    if(validator.isDefinedValue(postSubscriberResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postSubscriberResponse, FzCommand.POST_INSERTSUBSCRIBER, true);
    let referenceValue = postSubscriberResponse.data.referenceValue;
    if(validator.isDefinedValue(referenceValue) === false){
        throw exception.missingOrInvalidParameter(`missing referenceValue`);
    }
}

exports.validateDeleteSubscriberResponse = (deleteSubscriberResponse) => {
    if(validator.isDefinedValue(deleteSubscriberResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteSubscriberResponse, FzCommand.DELETE_INSERTSUBSCRIBER, true);
}