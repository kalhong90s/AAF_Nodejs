let configurations;
const FzConfig = require('../../constants/fz-config');
const validate = require('validator');

isDefinedValue = function(object) {
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
    return true;
}

validatePatternString = function(regex, value) {
    if(!isDefinedValue(regex) || !isDefinedValue(value)){
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

validateConfigurationCaseByCase = function(configValue, configurationName, isMandatory, isMultiple, regExFormat) {
    if(configurationName === FzConfig.MANAGED_DEVICE_ID_FORMAT.name){
        if(!validatePatternString('^(0|1)\\|(0|1)\\|(0|1)\\|(0|1)$', configValue)){
            console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing value format!!!)`);
            return false;
        }
    }
    return true;
}

isValidValue = function(configValue, configurationName, isMandatory, isMultiple, regExFormat) {
    if(isMandatory === true && isDefinedValue(configValue) === false){
        //config is define value
        console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (undefined value !!!)`);
        return false;
    }else if(isMandatory === false && isDefinedValue(configValue) === false){
        //console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Success`);
        console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)}`);
        return true;
    }

    if(isMultiple === true){
        if(typeof configValue !== 'object'){
            console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing multiple format !!!)`);
            return false;
        }
        
        for(let value of Object.values(configValue)){
            if(!isDefinedValue(value)){
                //config is define value
                console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (undefined value !!!)`);
                return false;
            }
            if(typeof value !== regExFormat){
                console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (wrong value format !!!)`);
                return false;
            }
        }
    }else{
        if(typeof configValue === 'object'){
            console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing single format !!!)`);
            return false;
        }

        if(typeof configValue !== regExFormat){
            console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (wrong value format !!!)`);
            return false;
        }
    }

    if(!validateConfigurationCaseByCase(configValue, configurationName, isMandatory, isMultiple, regExFormat)){
        return false;
    }

    //console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Success`);
    console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)}`);
    return true;
}

isValidConfig = function(configValue, modelConfig) {
    let configurationName = modelConfig.name;
    let isMandatory = modelConfig.isMandatory;
    let isMultiple = modelConfig.isMultiple;
    let regExFormat = modelConfig.regExFormat;
    let subConfig = modelConfig.subConfig;

    if(isMandatory === true && isDefinedValue(configValue) === false){
        //config is define value
        console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (undefined value !!!)`);
        return false;
    }else if(isMandatory === false && isDefinedValue(configValue) === false){
        //console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Success`);
        console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)}`);
        return true;
    }
    
    if(subConfig){
        if(typeof configValue !== 'object'){
            console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing group format !!!)`);
            return false;
        }

        if(isMultiple === true){
            if(Array.isArray(configValue) === false){
                console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing group multiple format !!!)`);
                return false;
            }
        }else{
            if(Array.isArray(configValue) === true){
                console.info(`Configuration name is ${configurationName} : ${JSON.stringify(configValue)} -> Fail (missing group single format !!!)`);
                return false;
            }
        }

        let tmpValue = [];
        if(Array.isArray(configValue) === true){
            tmpValue = configValue;
        }else{
            tmpValue.push(configValue);
        }

        let passGroup = true;
        let i = 1;
        for(let val of tmpValue){    
            for(let subConfig of Object.values(modelConfig.subConfig)){
                let msgConfigName = `[${configurationName}]${subConfig.name}`;
                if(isMultiple === true){
                    msgConfigName = `[${configurationName}:${i}]${subConfig.name}`;
                }
                let passVal = isValidValue(val[subConfig.name], msgConfigName, subConfig.isMandatory, subConfig.isMultiple, subConfig.regExFormat);
                passGroup = passGroup && passVal;
            }
            i++;
        }
        return passGroup;
    }else{
        return isValidValue(configValue, configurationName, isMandatory, isMultiple, regExFormat);
    }
}

exports.verifyConfiguration = function() {
    //Object.keys, values, entries
    console.info(`================= VERIFY CONFIGURATION ENVIRONMENT(${process.env.NODE_ENV}) =================`);
    configurations = this.utils().app();
    if(!configurations){
        configurations = {};
    }

    let verifyConfigSuccess = true;

    for(let modelConfig of Object.values(FzConfig)) {
        let configurationName = modelConfig.name;
        let configValue = configurations.conf(configurationName);

        let validConfig = isValidConfig(configValue, modelConfig);
        verifyConfigSuccess = verifyConfigSuccess && validConfig;
    }

    if(verifyConfigSuccess){
        console.info(`================= VERIFY CONFIGURATION ( SUCCESS ) =================`);
    }else{
        console.info(`================= VERIFY CONFIGURATION ( FAIL!!!!!) =================`);
        process.exit(1);
    }
    return verifyConfigSuccess;
}

exports.getValue = function(model) {
    let value = {};
    if(model.subConfig){
        if(model.isMultiple === false){
            for(let subConfig of Object.values(model.subConfig)){
                let subconfigName = subConfig.name; 
                value[subconfigName.toUpperCase()] = configurations.conf(model.name)[subconfigName];
            }       
        }else{
            value = [];
            for(let list of Object.values(configurations.conf(model.name))){
                let val = {};
                for(let subConfig of Object.values(model.subConfig)){
                    val[subConfig.name.toUpperCase()] = list[subConfig.name];
                }
                value.push(val);
            }
        }
    }else{
        value = configurations.conf(model.name);
    }
    return value;
}

/*exports.getValue2 = function(configName, subConfigname) {
    try {
        let value = configurations[configName];
        if(subConfigname){
            return value[subConfigname];
        }   
        return value;
    } catch (error) {
        
    }
}*/