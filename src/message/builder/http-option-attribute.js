const generator = require('../../utils/generator');

let createOptionAttribute = (sessionID, timeout, method, body, command, headers, node, params) => {
    let optionAttribute = {};
    optionAttribute.command = command ? command : '';
    optionAttribute.method = method ? method : '';
    optionAttribute.headers = headers ? headers : undefined;
    optionAttribute.timeout = timeout ? timeout : 5000;
    optionAttribute.node = node ? node : '';
    optionAttribute.body = body ? body : undefined;
    optionAttribute.invoke = generator.generateInvoke(sessionID, command);
    optionAttribute.params = params ? params : undefined;
    optionAttribute.isWriteDetailLog = true;
    return optionAttribute;
}

module.exports = createOptionAttribute;
