const isUtils = require('./is.util');
const objUtils = require('./obj.util');
const httpUtils = require('./http.util');
const loggerUtils = require('./logger');

const {isEmpty} = isUtils;
const {pick, without} = objUtils;
const {statusCodes} = httpUtils;
const {logger} = loggerUtils;

function resStub(mapFn) {
    return {
        status: () => {},
        json: mapFn
    };
}

function getToken(req) {
    return req.get('Authorization') && /(Bearer )(\S+)/.exec(req.get('Authorization'))[2];
}

function reqParse(req) {
    const params = {};

    if (!isEmpty(req.query)) {
        Object.assign(params, req.query);
    } else if (!isEmpty(req.body)) {
        Object.assign(params, req.body);
    }

    if (!isEmpty(req.additionalParams)) {
        Object.assign(params, req.additionalParams);
    }

    return Object.assign(params, without(req, ['query', 'body', 'additionalParams']));
}

function resolveOrReject({success, message, result, code}, resolve, reject) {
    return success ? resolve(result) : reject({message, code});
}

function tryParseBody(resp) {
    let respBody;

    try {
        respBody = JSON.parse(resp.body);
    } catch (ex) {
        respBody = {};
    }

    return respBody;
}

function requestHandler(res, defaultMessage, payloadKey, formatter) {
    const requestStartTime = (new Date()).valueOf();

    return (err, resp) => {
        const requestEndTime = (new Date()).valueOf();
        const respBody = tryParseBody(resp);
        const {statusCode, statusMessage} = resp || {};
        const {success, message} = respBody || {};
        let result;
        if (payloadKey) {
            if (typeof payloadKey === 'string') {
                result = respBody[payloadKey];
            } else if (Array.isArray(payloadKey)) {
                result = pick(respBody, payloadKey);
            } else {
                result = respBody;
            }
        } else {
            result = respBody;
        }

        if (err) {
            logger.error(err);
        } else {
            const {req: {method, path}} = resp;
            logger.info(`External ${method} request to '${path}' completed in ${
                requestEndTime - requestStartTime
            } milliseconds`);
        }

        if (statusMessage) {
            logger.info(statusMessage);
        }

        res.json(formatter ? formatter(err, success, statusCode, result, message, defaultMessage) : {
            success,
            result,
            message: `${success ? 'Successfully able to' : 'Failed to'} ${defaultMessage}`,
            code: +statusCode || (success ? 200 : 500)
        });
    };
}

function errorHandler(res = {
    status: () => {}, json: () => {}
}) {
    return (err) => {
        logger.error(err);
        const {message, code} = err;
        res.status(code);
        res.json({code, message, success: false});
    };
}

function parseError(err) {
    return err && err.message ? err.message : err;
}

class ExtendableError extends Error {
    constructor(message = '', code = 500) {
        super();
        this.code = code;
        this.status = (statusCodes[+code] || {}).status;
        this.message = message;
        this.stack = this.stack || (new Error()).stack;
    }
}

Object.assign(exports, {
    getToken,
    resStub,
    reqParse,
    resolveOrReject,
    tryParseBody,
    requestHandler,
    parseError,
    errorHandler,
    ExtendableError
});

