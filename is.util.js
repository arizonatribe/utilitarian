/* eslint max-len: ["error", 120, 4, {ignorePattern: "RegExp"}] */
/* eslint no-prototype-builtins: "off" */
const url = require('url');

const emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
const passwordRegex = new RegExp(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,20})/);

function toStringie(i) {
    return Object.prototype.toString.call(i);
}

function isNumber(n) {
    return typeof n === 'number';
}

function isBoolean(b) {
    return typeof b === 'boolean';
}

function isString(str) {
    return typeof str === 'string';
}

function isArray(arr) {
    return Array.isArray(arr);
}

function isRegExp(r) {
    return toStringie(r) === '[object RegExp]';
}

function isFunction(fn) {
    return toStringie(fn) === '[object Function]';
}

function isDate(dt) {
    return toStringie(dt) === '[object Date]';
}

function isObject(obj) {
    return toStringie(obj) === '[object Object]';
}

function isObjecty(obj) {
    return isObject(obj) || isArray(obj);
}

function isNullOrUndefined(val) {
    return val == null;
}

function isNull(val) {
    return val === null;
}

function isUndefined(val) {
    return typeof val === 'undefined';
}

function isAnyType(val) {
    return isNumber(val) || isString(val) || isArray(val) || isBoolean(val) ||
      isObject(val) || isDate(val) || isFunction(val) || isRegExp(val);
}

function isEmpty(val) {
    return isNullOrUndefined(val) ||
      (isString(val) && !val) ||
      (isArray(val) && !val.length) ||
      (isObject(val) && (!Object.keys(val).length));
}

function isNonEmptyStringOrNumber(s) {
    return !isEmpty(s) && (isString(s) || isNumber(s));
}

function has(obj, prop) {
    return isObject(obj) && obj.hasOwnProperty(prop);
}

function size(val) {
    if (isObject(val)) {
        return Object.keys(val).length;
    }

    return (isString(val) || isArray(val)) ? val.length : 0;
}

function isValidUri(uri) {
    return Boolean(url.parse(uri).host);
}

function isValidImageUri(uri) {
    return /(png|jpg|gif|jpeg|tiff|bmp)$/i.test(uri);
}

function isValidEmail(email) {
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return passwordRegex.test(password);
}

function isStringNumberBoolOrDate(val) {
    return isString(val) || isNumber(val) || isDate(val) || isBoolean(val);
}

function deeplyTruthy(collection) {
    return collection.every((expression) => {
        if (isArray(expression)) {
            return deeplyTruthy(expression);
        } else if (isObject(expression)) {
            return deeplyTruthy(Object.values(expression));
        }

        return !!expression;
    });
}

function isTruthy(expression) {
    if (isArray(expression)) {
        return deeplyTruthy(expression);
    } else if (isObject(expression)) {
        return deeplyTruthy(Object.values(expression));
    }

    return isFunction(expression) ? isTruthy(expression()) : !!expression;
}

function parsePort(port) {
    const parsedPort = +port;

    if (isNaN(parsedPort)) {
        throw new Error(`Port ${parsedPort} is invalid`);
    }

    return parsedPort;
}

Object.assign(exports, {
    size,
    has,
    isEmpty,
    isNonEmptyStringOrNumber,
    isAnyType,
    isArray,
    isObject,
    isObjecty,
    isFunction,
    isBoolean,
    isDate,
    isNumber,
    isString,
    isRegExp,
    isNull,
    isValidUri,
    isValidImageUri,
    isValidEmail,
    isValidPassword,
    isStringNumberBoolOrDate,
    isTruthy,
    deeplyTruthy,
    emailRegex,
    parsePort,
    passwordRegex,
    isNullOrUndefined,
    isUndefined
});

