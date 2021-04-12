const FzEventName = require('../constants/fz-exception-event');

exports.connectionError = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.CONNECTION_ERROR;
    err.message = message;
    return err;
}

exports.connectionTimeout = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.CONNECTION_TIMEOUT;
    err.message = message;
    return err;
}

exports.undefinedException = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.UNDEFINED;
    err.message = message;
    return err;
}

exports.missingOrInvalidParameter = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.MISSING_OR_INVALID_PARAMETER;
    err.message = message;
    return err;
}

exports.systemError = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.SYSTEM_ERROR;
    err.message = message;
    return err;
}

exports.dataNotFound = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.DATA_NOT_FOUND;
    err.message = message;
    return err;
}

exports.DATA_EXIST = (message) => {
    const err = new Error(message);
    err.prototype = Object.create(Error.prototype);
    err.event = FzEventName.DATA_EXIST;
    err.message = message;
    return err;
}