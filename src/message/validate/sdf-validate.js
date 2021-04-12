const exception = require('../../exception/exceptions');
const FzCommand = require('../../constants/fz-client-command-name');
const validator = require('../../utils/validator');
const messageUtils = require('../../utils/message-utils');
const value = require('./response-validate');

exports.validateGetGupCommonResponse = (getGupCommonResponse) => {
    if(validator.isDefinedValue(getGupCommonResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(getGupCommonResponse, FzCommand.GET_GUPCOMMON, false);
}

exports.validateGetGupGlobalServiceResponse = (getGupGlobalServiceResponse) => {
    if(validator.isDefinedValue(getGupGlobalServiceResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(getGupGlobalServiceResponse, FzCommand.GET_GUPGLOBALSERVICE, false);
}

exports.validateGetStbManageDeviceProfile = (getStbManageDeviceProfileResponse) => {
    if(validator.isDefinedValue(getStbManageDeviceProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(getStbManageDeviceProfileResponse, FzCommand.GET_STBMANAGEDEVICEPROFILE, false);
}

exports.validateGupDeviceResponse = (getGupDeviceResponse) => {
    if(validator.isDefinedValue(getGupDeviceResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(getGupDeviceResponse, FzCommand.GET_GUPDEVICE, false);
}

exports.validatePostSubscriberResponse = (postSubscriberResponse) => {
    if(validator.isDefinedValue(postSubscriberResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postSubscriberResponse, FzCommand.POST_INSERTSUBSCRIBER, false);
    let matchedDN = postSubscriberResponse.data.matchedDN;
    if(validator.isDefinedValue(matchedDN) === false){
        throw exception.missingOrInvalidParameter(`missing matchedDN`);
    }
    let uid = messageUtils.getValueFromDN(matchedDN, 'uid');
    if(validator.isDefinedValue(uid) === false){
        throw exception.missingOrInvalidParameter(`missing uid`);
    }
}

exports.validateDeleteSubscriberResponse = (deleteSubscriberResponse) => {
    if(validator.isDefinedValue(deleteSubscriberResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteSubscriberResponse, FzCommand.DELETE_INSERTSUBSCRIBER, false);
}

exports.validatePostGupImpiResponse = (postGupImpiResponse) => {
    if(validator.isDefinedValue(postGupImpiResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupImpiResponse, FzCommand.POST_GUPIMPI, false);
}

exports.validatePostGupImpuResponse = (postGupImpuResponse) => {
    if(validator.isDefinedValue(postGupImpuResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupImpuResponse, FzCommand.POST_GUPIMPU, false);
}

exports.validatePostGupSubProfileResponse = (postGupSubProfileResponse) => {
    if(validator.isDefinedValue(postGupSubProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupSubProfileResponse, FzCommand.POST_GUPSUBPROFILE, false);
}

exports.validatePostGupDeviceResponse = (postGupDeviceResponse) => {
    if(validator.isDefinedValue(postGupDeviceResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupDeviceResponse, FzCommand.POST_GUPDEVICE, false);
}

exports.validatePostModifyIdentityResponse = (postModifyIdentityResponse) => {
    if(validator.isDefinedValue(postModifyIdentityResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postModifyIdentityResponse, FzCommand.POST_MODIFYIDENTITY, false);
}

exports.validatePostGupServiceProfileResponse = (postGupServiceProfileResponse) => {
    if(validator.isDefinedValue(postGupServiceProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupServiceProfileResponse, FzCommand.POST_GUPSERVICEPROFILE, false);
}

exports.validateDeleteGupServiceProfileResponse = (deleteGupServiceProfileResponse) => {
    if(validator.isDefinedValue(deleteGupServiceProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteGupServiceProfileResponse, FzCommand.DELETE_GUPSERVICEPROFILE, false);
}

exports.validatePostGupServiceElementResponse = (postGupServiceElementResponse) => {
    if(validator.isDefinedValue(postGupServiceElementResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(postGupServiceElementResponse, FzCommand.POST_GUPSERVICEELEMENT, false);
}

exports.validateDeleteGupDeviceResponse = (deleteGupDeviceResponse) => {
    if(validator.isDefinedValue(deleteGupDeviceResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteGupDeviceResponse, FzCommand.DELETE_GUPEVICE, false);
}

exports.validateDeleteGupSubProfileResponse = (deleteGupSubProfileResponse) => {
    if(validator.isDefinedValue(deleteGupSubProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteGupSubProfileResponse, FzCommand.DELETE_GUPSUBPROFILE, false);
}

exports.validateDeleteGupImpuResponse = (deleteGupImpuResponse) => {
    if(validator.isDefinedValue(deleteGupImpuResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteGupImpuResponse, FzCommand.DELETE_GUPIMPU, false);
}

exports.validatePutGupServiceElementResponse = (putGupServiceElementResponse) => {
    if(validator.isDefinedValue(putGupServiceElementResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(putGupServiceElementResponse, FzCommand.PUT_GUPSERVICEELEMENT, false);
}

exports.validatePutGupImpiResponse = (putGupImpiResponse) => {
    if(validator.isDefinedValue(putGupImpiResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(putGupImpiResponse, FzCommand.PUT_GUPIMPI, false);
}

exports.validatePutGupSubProfileResponse = (putGupSubProfileResponse) => {
    if(validator.isDefinedValue(putGupSubProfileResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(putGupSubProfileResponse, FzCommand.PUT_GUPSUBPROFILE, false);
}

exports.validatePutGupImpuResponse = (putGupImpuResponse) => {
    if(validator.isDefinedValue(putGupImpuResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(putGupImpuResponse, FzCommand.PUT_GUPIMPU, false);
}

exports.validateDeleteGupImpiResponse = (deleteGupImpiResponse) => {
    if(validator.isDefinedValue(deleteGupImpiResponse) === false){
        throw exception.systemError('Cannot get response message');
    }
    value.validateResponse(deleteGupImpiResponse, FzCommand.DELETE_GUPIMPI, false);
}