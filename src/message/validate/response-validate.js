const exception = require('../../exception/exceptions');
const validator = require('../../utils/validator');
const FzStatus = require('../../constants/fz-status');

exports.validatorString = (name, value) => {
    if (!validator.isDefinedValue(value)) {
        throw exception.missingOrInvalidParameter(`${name} is Missing or Invalid`);
    }
}

validatorConnectionError = (statusCode) => {
    if(statusCode === FzStatus.CONNECTION_TIMEOUT.RESULT_CODE){
        throw exception.connectionTimeout('Connection Timeout');
    }else if(statusCode === FzStatus.CONNECTION_ERROR.RESULT_CODE){
        throw exception.connectionError('Connection Error');
    }
}

exports.validateResponseMethodGET = (response, commandName, isDeveloperMessage) => {
    let statusCode = response.statusCode;
    //1 validate status
    if(!validator.isDefinedValue(statusCode)){
        throw exception.systemError('Missing Status Code');
    }
    
    //2 validate connection error
    validatorConnectionError(statusCode);

    let data = response.data;
    //3 validate data
    if(!validator.isDefinedValue(data)){
        throw exception.systemError('Not received Data response');
    }

    //4 validate result, description
    if(validator.isDefinedValue(isDeveloperMessage) === false){
        isDeveloperMessage = false;
    }
    let resultCode = data.resultCode;
    this.validatorString('resultCode', resultCode);
    if(isDeveloperMessage === true){
        let developerMessage = data.developerMessage;
        this.validatorString('developerMessage', developerMessage);
    }else{
        let resultDesc = data.resultDescription;
        this.validatorString('resultDescription', resultDesc);
    }

    if(FzStatus.SUCCESS.STATUS_CODE === statusCode && FzStatus.SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.DATA_NOT_FOUND.STATUS_CODE === statusCode && FzStatus.DATA_NOT_FOUND.RESULT_CODE === resultCode){
        throw exception.dataNotFound(`Received ${commandName} response Data Not Found`);
    }else if(FzStatus.MISSING_OR_INVALID_PARAMETER.STATUS_CODE === FzStatus && FzStatus.MISSING_OR_INVALID_PARAMETER.RESULT_CODE === resultCode){
        throw exception.missingOrInvalidParameter(`Received ${commandName} response Missing or Invalid Parameter`);
    }
    throw exception.systemError(`Reveived HTTP status code (${statusCode}) is invalid`);
}

exports.validateResponseMethodDELETE = (response, commandName, isDeveloperMessage) => {
    let statusCode = response.statusCode;
    //1 validate status
    if(!validator.isDefinedValue(statusCode)){
        throw exception.systemError('Missing Status Code');
    }
    
    //2 validate connection error
    validatorConnectionError(statusCode);

    let data = response.data;
    //3 validate data
    if(!validator.isDefinedValue(data)){
        throw exception.systemError('Not received Data response');
    }

    //4 validate result, description
    if(validator.isDefinedValue(isDeveloperMessage) === false){
        isDeveloperMessage = false;
    }
    let resultCode = data.resultCode;
    this.validatorString('resultCode', resultCode);
    if(isDeveloperMessage === true){
        let developerMessage = data.developerMessage;
        this.validatorString('developerMessage', developerMessage);
    }else{
        let resultDesc = data.resultDescription;
        this.validatorString('resultDescription', resultDesc);
    }

    if(FzStatus.SUCCESS.STATUS_CODE === statusCode && FzStatus.SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.DATA_NOT_FOUND.STATUS_CODE === statusCode && FzStatus.DATA_NOT_FOUND.RESULT_CODE === resultCode){
        throw exception.dataNotFound(`Received ${commandName} response Data Not Found`);
    }else if(FzStatus.MISSING_OR_INVALID_PARAMETER.STATUS_CODE === FzStatus && FzStatus.MISSING_OR_INVALID_PARAMETER.RESULT_CODE === resultCode){
        throw exception.missingOrInvalidParameter(`Received ${commandName} response Missing or Invalid Parameter`);
    }
    throw exception.systemError(`Reveived HTTP status code (${statusCode}) is invalid`);
}

exports.validateResponseMethodPOST = (response, commandName, isDeveloperMessage) => {
    let statusCode = response.statusCode;
    //1 validate status
    if(!validator.isDefinedValue(statusCode)){
        throw exception.systemError('Missing Status Code');
    }
    
    //2 validate connection error
    validatorConnectionError(statusCode);

    let data = response.data;
    //3 validate data
    if(!validator.isDefinedValue(data)){
        throw exception.systemError('Not received Data response');
    }

    //4 validate result, description
    if(validator.isDefinedValue(isDeveloperMessage) === false){
        isDeveloperMessage = false;
    }
    let resultCode = data.resultCode;
    this.validatorString('resultCode', resultCode);
    if(isDeveloperMessage === true){
        let developerMessage = data.developerMessage;
        this.validatorString('developerMessage', developerMessage);
    }else{
        let resultDesc = data.resultDescription;
        this.validatorString('resultDescription', resultDesc);
    }

    if(FzStatus.SUCCESS.STATUS_CODE === statusCode && FzStatus.SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.CREATE_SUCCESS.STATUS_CODE === statusCode && FzStatus.CREATE_SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.DATA_NOT_FOUND.STATUS_CODE === statusCode && FzStatus.DATA_NOT_FOUND.RESULT_CODE === resultCode){
        throw exception.dataNotFound(`Received ${commandName} response Data Not Found`);
    }else if(FzStatus.DATA_EXIST.STATUS_CODE === statusCode && FzStatus.DATA_EXIST.RESULT_CODE === resultCode){
        throw exception.DATA_EXIST(`Received ${commandName} response Data Exist`);
    }else if(FzStatus.MISSING_OR_INVALID_PARAMETER.STATUS_CODE === FzStatus && FzStatus.MISSING_OR_INVALID_PARAMETER.RESULT_CODE === resultCode){
        throw exception.missingOrInvalidParameter(`Received ${commandName} response Missing or Invalid Parameter`);
    }
    throw exception.systemError(`Reveived HTTP status code (${statusCode}) is invalid`);
}

exports.validateResponseMethodPUT = (response, commandName, isDeveloperMessage) => {
    let statusCode = response.statusCode;
    //1 validate status
    if(!validator.isDefinedValue(statusCode)){
        throw exception.systemError('Missing Status Code');
    }
    
    //2 validate connection error
    validatorConnectionError(statusCode);

    let data = response.data;
    //3 validate data
    if(!validator.isDefinedValue(data)){
        throw exception.systemError('Not received Data response');
    }

    //4 validate result, description
    if(validator.isDefinedValue(isDeveloperMessage) === false){
        isDeveloperMessage = false;
    }
    let resultCode = data.resultCode;
    this.validatorString('resultCode', resultCode);
    if(isDeveloperMessage === true){
        let developerMessage = data.developerMessage;
        this.validatorString('developerMessage', developerMessage);
    }else{
        let resultDesc = data.resultDescription;
        this.validatorString('resultDescription', resultDesc);
    }

    if(FzStatus.SUCCESS.STATUS_CODE === statusCode && FzStatus.SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.CREATE_SUCCESS.STATUS_CODE === statusCode && FzStatus.CREATE_SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.DATA_NOT_FOUND.STATUS_CODE === statusCode && FzStatus.DATA_NOT_FOUND.RESULT_CODE === resultCode){
        throw exception.dataNotFound(`Received ${commandName} response Data Not Found`);
    }else if(FzStatus.DATA_EXIST.STATUS_CODE === statusCode && FzStatus.DATA_EXIST.RESULT_CODE === resultCode){
        throw exception.DATA_EXIST(`Received ${commandName} response Data Exist`);
    }else if(FzStatus.MISSING_OR_INVALID_PARAMETER.STATUS_CODE === FzStatus && FzStatus.MISSING_OR_INVALID_PARAMETER.RESULT_CODE === resultCode){
        throw exception.missingOrInvalidParameter(`Received ${commandName} response Missing or Invalid Parameter`);
    }
    throw exception.systemError(`Reveived HTTP status code (${statusCode}) is invalid`);
}

exports.validateResponse = (response, commandName, isDeveloperMessage) => {
    let statusCode = response.statusCode;
    //1 validate status
    if(!validator.isDefinedValue(statusCode)){
        throw exception.systemError('Missing Status Code');
    }
    
    //2 validate connection error
    validatorConnectionError(statusCode);

    let data = response.data;
    //3 validate data
    if(!validator.isDefinedValue(data)){
        throw exception.systemError('Not received Data response');
    }

    //4 validate result, description
    if(validator.isDefinedValue(isDeveloperMessage) === false){
        isDeveloperMessage = false;
    }
    let resultCode = data.resultCode;
    this.validatorString('resultCode', resultCode);
    if(isDeveloperMessage === true){
        let developerMessage = data.developerMessage;
        this.validatorString('developerMessage', developerMessage);
    }else{
        let resultDesc = data.resultDescription;
        this.validatorString('resultDescription', resultDesc);
    }

    if(FzStatus.SUCCESS.STATUS_CODE === statusCode && FzStatus.SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.CREATE_SUCCESS.STATUS_CODE === statusCode && FzStatus.CREATE_SUCCESS.RESULT_CODE === resultCode){
        return;
    }else if(FzStatus.DATA_NOT_FOUND.STATUS_CODE === statusCode && FzStatus.DATA_NOT_FOUND.RESULT_CODE === resultCode){
        throw exception.dataNotFound(`Received ${commandName} response Data Not Found`);
    }else if(FzStatus.DATA_EXIST.STATUS_CODE === statusCode && FzStatus.DATA_EXIST.RESULT_CODE === resultCode){
        throw exception.DATA_EXIST(`Received ${commandName} response Data Exist`);
    }else if(FzStatus.MISSING_OR_INVALID_PARAMETER.STATUS_CODE === FzStatus && FzStatus.MISSING_OR_INVALID_PARAMETER.RESULT_CODE === resultCode){
        throw exception.missingOrInvalidParameter(`Received ${commandName} response Missing or Invalid Parameter`);
    }
    throw exception.systemError(`Reveived HTTP status code (${statusCode}) is invalid`);
}