const exception = require('../../exception/exceptions');
const validator = require('../../utils/validator');
const FzIdentityType = require('../../constants/fz-identity-type');
const value = require('./response-validate');

exports.validateGetPrivateId = (getPrivateIdRequest) => {

    if (!validator.isDefinedValue(getPrivateIdRequest)) {
        throw exception.undefinedException('Not received query request message');
    }
    let commandId = getPrivateIdRequest.commandId;
    let publicId = getPrivateIdRequest.publicId;
    value.validatorString('commandId', commandId);
    value.validatorString('publicId', publicId);
}

exports.validatePostSubscriptions = (postSubscriptionsRequest) => {
    if (!validator.isDefinedValue(postSubscriptionsRequest)) {
        throw exception.missingOrInvalidParameter('Not received post subscriptions request message');
    }

    let idType = postSubscriptionsRequest.idType;
    value.validatorString('idType', idType);
    let idValue = postSubscriptionsRequest.idValue;
    value.validatorString('idValue', idValue);

    if (idType === FzIdentityType.MSISDN) {
        if (!validator.isMsisdn(idValue)) {
            throw exception.missingOrInvalidParameter(`idValue isn't msisdn`);
        }
    } else {
        if (idType !== FzIdentityType.EMAIL) {
            throw exception.missingOrInvalidParameter(`Not support idType ${idType}`);
        }
    }

    let commandId = postSubscriptionsRequest.commandId;
    value.validatorString('commandId', commandId);
    let appName = postSubscriptionsRequest.appName;
    value.validatorString('appName', appName);
    
    let credential = postSubscriptionsRequest.credential;
    if(credential != undefined){
        value.validatorString('credentialType', credential.type);
        value.validatorString('credentialValue', credential.value);
    }

}


exports.validateGetCustomerIdentity = (getCustomerId) => {
    if (!getCustomerId) {
        throw exception.undefinedException('Not received Get customerIdentity body from request');
    }

    if (!validator.isDefinedValue(getCustomerId)) {
        throw exception.undefinedException('Not received post subscriptions request message');
    }

    let identityType = getCustomerId.identityType;
    value.validatorString('identityType', identityType);
    let identityValue = getCustomerId.identityValue;
    value.validatorString('identityValue', identityValue);
    let commandId = getCustomerId.commandId;
    value.validatorString('commandId', commandId);
    let IdentityTypeRequire = getCustomerId.IdentityTypeRequire;
    value.validatorString('IdentityTypeRequire', IdentityTypeRequire);
}

exports.validatePostCheckPublicAvailability = (postCheckPublicAvailabilityRequest) => {
    if(!postCheckPublicAvailabilityRequest) {
        throw exception.missingOrInvalidParameter('Not received Post CheckPublicAvailability Request Message');
    }
    let idType = postCheckPublicAvailabilityRequest.idType;
    value.validatorString('idType', idType);
    let idValue = postCheckPublicAvailabilityRequest.idValue;
    value.validatorString('idValue', idValue);

    if (idType === FzIdentityType.MSISDN) {
        if (!validator.isMsisdn(idValue)) {
            throw exception.missingOrInvalidParameter(`idValue isn't msisdn`);
        }
    } else {
        if (idType !== FzIdentityType.EMAIL) {
            throw exception.missingOrInvalidParameter(`Not support idType ${idType}`);
        }
    }

    let commandId = postCheckPublicAvailabilityRequest.commandId;
    value.validatorString('commandId', commandId);
    let appName = postCheckPublicAvailabilityRequest.appName;
    value.validatorString('appName', appName);
    
}

exports.validatePostAuthenticateCustomer = (postAuthenticateCustomerRequest) => {
    if (!validator.isDefinedValue(postAuthenticateCustomerRequest)) {
        throw exception.undefinedException('Not received post AuthenticateCustomer request message');
    }

    let idType = postAuthenticateCustomerRequest.idType;
    value.validatorString('idType', idType);
    let idValue = postAuthenticateCustomerRequest.idValue;
    value.validatorString('idValue', idValue);

    if (idType === FzIdentityType.MSISDN) {
        if (!validator.isMsisdn(idValue)) {
            throw exception.undefinedException(`idValue isn't msisdn`);
        }
    } else {
        if (idType !== FzIdentityType.EMAIL) {
            throw exception.undefinedException(`Not support idType ${idType}`);
        }
    }

    let commandId = postAuthenticateCustomerRequest.commandId;
    value.validatorString('commandId', commandId);

    if(!validator.isDefinedValue(postAuthenticateCustomerRequest.authenticateServiceIdFlag) || postAuthenticateCustomerRequest.authenticateServiceIdFlag.toLowerCase() == "y"){
        let appName = postAuthenticateCustomerRequest.appName;
        value.validatorString('appName', appName);
    }

    let credential = postAuthenticateCustomerRequest.credential;
    if(validator.isDefinedValue(credential)){
        value.validatorString('credentialType', credential.type);
        value.validatorString('credentialValue', credential.value);
    }else{
        throw exception.undefinedException(`Credential is missing!`);
    }
}

exports.validatePostPushNotification = (pushNotificationInfoRequest) => {
    if (!validator.isDefinedValue(pushNotificationInfoRequest)) {
        throw exception.undefinedException('Not received post PushNotificationInfo request message');
    }

    value.validatorString('commandId', pushNotificationInfoRequest.commandId);
    value.validatorString('eventType', pushNotificationInfoRequest.eventType);
    let subscriptionId = pushNotificationInfoRequest.subscriptionId;
    value.validatorString('subscriptionId', subscriptionId);
    if(!subscriptionId.includes('\|')){
        throw exception.missingOrInvalidParameter(`subscriptionId is invalid format`);
    }

    let val = subscriptionId.split('|');
    if(!validator.equalsValue('3', val[0].trim()) && !validator.equalsValue('0', val[0].trim())){
        throw exception.missingOrInvalidParameter(`subscriptionId is invalid type`);
    }

    if(validator.equalsValue('0', val[0].trim()) === true && !validator.isMsisdn(val[1].trim())){
        throw exception.missingOrInvalidParameter(`subscriptionId is invalid msisdn format`);
    }

    const FzDomain = require('../../constants/fz-domain');
    if(validator.equalsValue('3', val[0].trim()) === true && !validator.isFbbId(val[1].trim() + FzDomain.FBB_AIS) === false){
        throw exception.missingOrInvalidParameter(`subscriptionId is invalid FBB format`);
    }

    if(validator.isDefinedValue(pushNotificationInfoRequest.publicId) === true){
        if(validator.isMsisdn(pushNotificationInfoRequest.publicId) === false && validator.isEmail(pushNotificationInfoRequest.publicId) === false){
            throw exception.missingOrInvalidParameter(`publicId is invalid msisdn/email format`);
        }
    }

    if(validator.equalsValue('unsubscribe', pushNotificationInfoRequest.eventType.toLowerCase()) === false){
        if(validator.isDefinedValue(pushNotificationInfoRequest.listOfApp) === false){
            throw exception.missingOrInvalidParameter(`unsubscribe is invalid not received listOfApp`);
        }
    }
}

exports.validateGetContactNumber = (getContactNumbeRequest) => {
    if(!getContactNumbeRequest) {
        throw exception.missingOrInvalidParameter('Not received Get ContactNumber Request Message');
    }
    let idType = getContactNumbeRequest.idType;
    value.validatorString('idType', idType);
    let idValue = getContactNumbeRequest.idValue;
    value.validatorString('idValue', idValue);
    let commandId = getContactNumbeRequest.commandId;
    value.validatorString('commandId', commandId);


    if (idType.toLowerCase() === FzIdentityType.FBBID) {
        if (!validator.isFbbId(idValue)) {
            throw exception.missingOrInvalidParameter(`idValue isn't fbbid`);
        }
    } else {
        if (idType.toLowerCase() !== FzIdentityType.PRIVATEID.toLocaleLowerCase()) {
            throw exception.missingOrInvalidParameter(`Not support idType ${idType}`);
        }
    }
    
}
