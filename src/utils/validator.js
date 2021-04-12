const valueEqual = require('value-equal');
const validate = require('validator');
const config = require('../configurations/config');
const FzDomain = require('../constants/fz-domain');

exports.isDefinedValue = (object) => {
    /*if(!object && !typeof object === 'boolean'){
        return false;
    }*/
        
    if(object === undefined || typeof object === 'undefined'){
        return false;
    }

    if(object === null){
        return false;
    }

    //String
    if(typeof object === 'string' || object instanceof String) {
        return !validate.isEmpty(object.trim());   
    }
    
    //Number
    if(typeof object === 'number' || object instanceof Number) {
        return true;
    }

    //Boolean
    if(typeof object === 'boolean' || object instanceof Boolean) {
        return true;
    }

    //Object
    let querylength = Object.getOwnPropertyNames(object).length;
    if(querylength === 0){
        return false;
    }

    if(Array.isArray(object) === true){
        if(object.length < 1){
            return false;
        }
    }

    return true;
}

exports.equalsValue = (x, y) => {
    return valueEqual(x,y);
}

exports.equalsValueIgnoreType = (x, y) => {
    if(this.isDefinedValue(x) && this.isDefinedValue(y)){
        if(JSON.stringify(x).trim() == JSON.stringify(y).trim()){
            return true;
        }
    }
    return false;
}

exports.isMsisdn = (value) => {
    if(!this.isDefinedValue(value)){
        return false;
    }
    return validate.isMobilePhone(value.trim(), 'th-TH'); 
    //return value.startsWith('66') && value.length === 11;
}

exports.isEmail = (value) => {
    if(!this.isDefinedValue(value)){
        return false;
    }
    let val = value.split(':', -1);
    return validate.isEmail(val[val.length -1]);
}

exports.isFbbId = (value) => {
    if(!this.isDefinedValue(value)){
        return false;
    }
    let prefixConfig = config.FBB_ID_FORMAT;
    for(let prefix of prefixConfig){
        if(value.startsWith(prefix.trim()) && value.endsWith(FzDomain.FBB_AIS.trim()) && value.length < 45){
            return true;
        }
    }
    return false;
}

exports.validatePatternString = (regex, value) => {
    if(!this.isDefinedValue(regex) || !this.isDefinedValue(value)){
        return false
    }

    let pattern = RegExp(regex);

    if(typeof value === 'string'){
        return pattern.test(value);
    }else{
        for(let val of Object.values(value)){
            if(!pattern.test(val)){
                return false;
            }
        }
        return true;
    }
}