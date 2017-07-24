/* eslint no-mixed-operators: "off" */
const md5 = require('md5');
const crypto = require('crypto');
const isUtils = require('./is.util');

const {isString, isNumber, isNonEmptyStringOrNumber, isObject, isArray, isValidImageUri} = isUtils;

const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const dataURIPrefixPattern = new RegExp(/data:image\/\w{1,5};base64,\s*/);

function getDataURIFileExtension(str) {
    const parsed = (str.split(';base64,')[0]).split('data:image/')[0];

    return isValidImageUri(parsed) ? parsed : '';
}

/**
 * Determines how many digits are to the right of a number or numeric string
 * @param {string|number} A number OR numeric string
 * @returns {number} The number of digits to the right of the decimal
 */
function numOfTrailingDigits(num) {
    return `${num}`.split('.')[1].length;
}

/**
 * Determines how many digits are to the left of a number or numeric string
 * @param {string|number} A number OR numeric string
 * @returns {number} The number of digits to the left of the decimal
 */
function numOfLeadingDigits(num) {
    return `${num}`.split('.')[0].length;
}

/**
 * Converts a number according to the decimal precision param, and handles
 * scientific notation properly too.
 * @param {string|number} A number or numeric string to format
 * @param {precision} The number of decimal places to prefer (defaults to 3)
 * @returns {string} A formatted numeric string
 */
function numberMe(num, precision = 3) {
    return Number((+num).toPrecision(numOfLeadingDigits(num) + precision));
}

/**
 * Generates a unique 36 character hyphenated GUID
 * @method galaxyutils.string.util#generateUUID
 * @returns {string} A string GUID
 */
function generateUUID() {
    let dat = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (cha) => {
        const ran = (dat + (Math.random() * 16)) % 16 | 0;
        dat = Math.floor(dat / 16);

        return (cha === 'x' ? ran : ran & 0x3 | 0x8).toString(16);
    });
}

function generateIdWithSuffix(suffix = '') {
    return `${generateUUID()}${suffix ? `:${suffix}` : ''}`;
}

function randomNumber(len) {
    return Math.round(Math.random() * (len - 1));
}

/**
 * Generates a random string of text of a given length.
 * Will generate an alpha-numeric string unless you specify a different character set as the second argument
 * @method galaxyutils.string.util#randomString
 * @param {number} length The length of the string to generate
 * @param {string|number} [charSet] optional set of characters to use when generating a random string
 * (defaults to full alpha-numeric set)
 * @returns {string|number} A randomly generated string or number
 */
function randomString(length, charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let str = '',
        isAllNumeric = false,
        isNegative = false,
        useCharSet = charSet;

    if (+length) {
        if (!isString(charSet)) {
            if (isNumber(charSet)) {
                if (+charSet) {
                    isAllNumeric = true;
                    isNegative = +charSet < 0;
                    useCharSet = `${Math.abs(+charSet)}`;
                } else {
                    useCharSet = ALPHANUMERIC_CHARS;
                }
            } else {
                useCharSet = ALPHANUMERIC_CHARS;
            }
        }
      
        const generateChar = function gc(len) {
            return Math.round(Math.random() * (len - 1));
        }.bind(null, useCharSet.length);
      
        str = Array(+length).fill().map((v, index) => {
            const newChar = generateChar();
            /* If we are generating a random number, make sure the first digit is not zero */
            if (!index && isAllNumeric && !newChar) {
                return useCharSet.charAt(newChar + 1);
            }

            return useCharSet.charAt(newChar);
        }).join('');
    }

    if (isAllNumeric) {
        return isNegative ? -+str : +str;
    }

    return str;
}

function camelize(str) {
    return str.replace(/[_-][a-z]/g, wordStart => wordStart[1].toUpperCase());
}

function capitalizeWords(str) {
    return isString(str) ? str.replace(/(?:^|\s)\S/g, s => s.toUpperCase()) : str;
}

function titleizeUrl(url) {
    return capitalizeWords(url.replace(/\//g, ' ')).replace(/ /g, '');
}

function removeSymbols(str) {
    return str.replace(/[.,:;"/\\`~=+[\]{}<>'!@#&*^()%$_]/g, '');
}

function hyphenate(str) {
    let formatted = str.replace(/ /g, '-');
    while (/--/.test(formatted)) {
        formatted = formatted.replace(/--/g, '-');
    }

    return formatted;
}

function generateBase64String() {
    return crypto.randomBytes(64).toString('base64');
}

function createPbkdf2Hash(salt, secret, digest = 'sha256') {
    if (!secret) {
        throw new Error('Missing Secret value for creating Hash');
    }

    if (!crypto.getHashes().includes(digest)) {
        throw new Error(`${digest} is not a valid digest option to create a hash`);
    }

    return crypto.pbkdf2Sync(secret, salt, 1000, 64, digest).toString('base64');
}

function createShaHash(str, digest = 'sha256') {
    if (!crypto.getHashes().includes(digest)) {
        throw new Error(`${digest} is not a valid digest option to verifying this hash`);
    }

    return crypto.createHash(digest).update(str, 'base64').digest('base64');
}

/**
 * Converts a string value to `Uint8array`
 * @method galaxyutils.string.util#toUint
 * @param {string} str A string value to convert to `Uint8array`
 * @returns {Uint8Array} A `Uint8Array` representation of the original string
 */
function toUint(str) {
    const string = window.btoa(unescape(encodeURIComponent(str))),
        chars = string.split(''),
        len = chars.length,
        uintArray = [];

    Array(len).fill().forEach((val, i) => uintArray.push(chars[i].charCodeAt(0)));

    return new Uint8Array(uintArray);
}

/**
 * Converts a string value to an `ArrayBuffer`
 * @method galaxyutils.string.util#toArrayBuffer
 * @param {string} str A string value to convert to `ArrayBuffer`
 * @returns {Uint8Array} An `ArrayBuffer` representation of the original string
 */
function toArrayBuffer(str) {
    /* eslint no-bitwise: "off" */
    const len = isString(str) ? str.length : 0,
        buf = new ArrayBuffer(len),
        view = new Uint8Array(buf);

    Array(len).fill().forEach((val, i) => (view[i] = str.charCodeAt(i) & 0xFF));

    return view;
}

/**
 * Converts a base64 encoded string to a `data:image/png` prefixed string,
 * ready to embed into an img HTML element
 * @method galaxyutils.string.util#toBase64ImageSrc
 * @param {string} str A base64 encoded image string
 * @returns {string} An formatted base64 image string
 */
function toBase64ImageSrc(str) {
    return (str ? `data:image/png;base64, ${str}` : '');
}

function formatDecimal(num = 0, precision = 2) {
    return +(Math.round(num * 100) / 100).toFixed(precision);
}

function fullTrim(str = '') {
    return str.replace(/\t|\n|\s+/g, ' ').trim();
}

function hashMe(value) {
    let str = (isString(value) || isNumber(value)) ? `${value}` : '';

    if (isArray(value)) {
        str = [...value.filter(isNonEmptyStringOrNumber)].sort().join('');
    } else if (isObject(value)) {
        str = Object.values(value).filter(isNonEmptyStringOrNumber).sort().join('');
    }

    return md5(str);
}

const StringUtils = {
    camelize,
    capitalizeWords,
    fullTrim,
    hyphenate,
    numOfTrailingDigits,
    numOfLeadingDigits,
    numberMe,
    removeSymbols,
    toArrayBuffer,
    toBase64ImageSrc,
    toUint
};

function setStringPrototypes() {
    Object.keys(StringUtils)
        .filter(prop => !Object.keys(String.prototype).includes(prop))
        .forEach((prop) => {
            /* eslint func-names: "off" */
            Object.assign(String.prototype, {
                [prop]: function(...args) {
                    return args.length ?
                        StringUtils[prop].apply(this, [this, ...args]) :
                        StringUtils[prop](this);
                }
            });
        });
}

Object.assign(exports, StringUtils, {
    hashMe,
    dataURIPrefixPattern,
    getDataURIFileExtension,
    formatDecimal,
    generateUUID,
    generateIdWithSuffix,
    randomNumber,
    randomString,
    titleizeUrl,
    generateBase64String,
    createPbkdf2Hash,
    createShaHash,
    setStringPrototypes
});

