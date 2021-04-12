module.exports = (req) => {
    let request = {};
    let params = req.params;
    let body = req.body;
    let headers = req.headers;
    let query = req.query;
    return Object.assign(request, headers, params, query, body);
}