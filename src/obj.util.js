const isUtils = require('./is.util');
const stringUtils = require('./string.util');

const {isFunction, isStringNumberBoolOrDate, isObject, isDate, isNumber, isString, isArray, isEmpty} = isUtils;
const {camelize} = stringUtils;

function hasNonEmptyValues(obj) {
    return Object.values(obj || {}).some(entry => !isEmpty(entry));
}

function stringifyArrayValues(obj = {}) {
    const parsed = {};

    Object.entries(obj).forEach((entry) => {
        const val = entry[1];

        if (isStringNumberBoolOrDate(val)) {
            /* Leave any non-array, primitive values alone */
            parsed[entry[0]] = val;
        } else if (isArray(val) && !isEmpty(val)) {
            parsed[entry[0]] = val.join(',');
        }
    });

    return parsed;
}

function arrayMe(val) {
    if (isArray(val)) return val;

    if (isObject(val) || isNumber(val) || isString(val) || isDate(val)) {
        return [val];
    }

    /* Sets, and other things Array.from() can convert */
    return Array.from(val);
}

function dateMe(dateValue) {
    if (isDate(dateValue)) return dateValue;
    if (isString(dateValue) || isNumber(dateValue)) {
        return new Date(dateValue);
    }

    return null;
}

function shuffle(a) {
    /* eslint no-plusplus: "off" */
    const cloned = [...a];

    for (let i = cloned.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [cloned[i - 1], cloned[j]] = [cloned[j], cloned[i - 1]];
    }

    return cloned;
}

function getNestedProperty(obj, dotPath) {
    let subGroup = Object.assign({}, obj),
        failedToFind;

    (isString(dotPath) ? dotPath.split('.') : []).forEach((prop) => {
        if (isObject(subGroup) && Object.keys(subGroup).includes(prop)) {
            subGroup = subGroup[prop];
        } else {
            failedToFind = true;
        }
    });

    return failedToFind ? '' : subGroup;
}

/**
* Transforms the properties in an object to an encoded URI query string.
* <b>Note</b>: works best if the object is in the format of
*   { propertyName: propertyValue, propertyName2: propertyValue2 . . }
* @method galaxyutils.obj.util#toURI
* @param {object} obj A JSON object to serialize into a query string
* @param {boolean} [dontEncode] An optional boolean value to control whether
* or not to URI encode the resulting query string (defaults to `false`)
* @returns {string} A query string representation of the original object
*/
function toURI(obj, dontEncode) {
    const arr = [];
    let paramVal;

    if (isObject(obj) && !isArray(obj)) {
        Object.keys(obj).forEach((val) => {
            if (isArray(obj[val])) {
                paramVal = `[${obj[val].join(',')}]`;
            } else {
                paramVal = obj[val];
            }

            if (dontEncode) {
                arr.push(`${val}=${paramVal}`);
            } else {
                arr.push(
                    `${encodeURIComponent(val)}=${encodeURIComponent(paramVal)}`
                );
            }
        });
    }

    return arr.join('&');
}

/**
* Serializes an object's properties into JSON string then URI encoded
* @method galaxyutils.obj.util#toParam
* @param {object} obj A JSON object to serialize into a query string parameter
* @param {boolean} [dontEncode] An optional boolean value to control whether or not to URI encode the resulting query parameter (defaults to `false`)
* @returns {string} A query string parameter representation of the original object
*/
function toParam(obj, dontEncode) {
    const arr = [];
    let vals;

    if (isObject(obj) && !isArray(obj)) {
        Object.keys(obj).forEach((val) => {
            if (isArray(obj[val])) {
                vals = `[${
                    obj[val].map(v => (isNaN(v) ? `"${v}"` : v)).join(',')
                }]`;
            } else {
                vals = isNaN(obj[val]) ? `"${obj[val]}"` : obj[val];
            }
            arr.push(`${val}:${vals}`);
        });

        if (dontEncode) {
            return `{${arr.join(',')}}`;
        }

        return encodeURIComponent(`{${arr.join(',')}}`);
    }

    return '';
}

function flatten(arr = []) {
    return [].concat(...arr);
}

function uniqueMe(arr = []) {
    return Array.from(new Set(arr));
}

function uniqueBy(arr = [], field = 'id') {
    return uniqueMe(arr.map(s => s[field]))
        .map(u => arr.find(a => a[field] === u))
        .filter(f => !isEmpty(f));
}

function formatObject(obj) {
    const oj = {};
    Object.keys(obj).forEach(key => Object.assign(oj, {[camelize(key)]: obj[key]}));

    return oj;
}

function mapEntries(obj, mapFn) {
    const fn = isFunction(mapFn) ? mapFn : entry => (entry);

    return Object.entries(obj).map(fn)
        .reduce((a, b) => Object.assign(a, {
            [b[0]]: b[1]
        }), {});
}

function pick(obj = {}, values = []) {
    const mappedObj = {};

    Object.keys(obj).filter(key => values.includes(key)).forEach((key) => {
        mappedObj[key] = obj[key];
    });

    return mappedObj;
}

function without(obj = {}, values = []) {
    const mappedObj = {};

    Object.keys(obj).filter(key => !values.includes(key)).forEach((key) => {
        mappedObj[key] = obj[key];
    });

    return mappedObj;
}

function intersect(ids) {
    if (!isArray(ids) || ids.some(i => isEmpty(arrayMe(i)))) {
        return [];
    }

    let intersectedIds = uniqueMe(flatten(ids.map(arrayMe)));

    ids.forEach((i) => {
        intersectedIds = arrayMe(i).filter(id => intersectedIds.includes(id));
    });

    return intersectedIds;
}

function pruneEmpties(obj) {
    const mappedObj = {};
    Object.entries(obj || {}).filter(entry => !isEmpty(entry[1])).forEach((entry) => {
        mappedObj[entry[0]] = entry[1];
    });

    return mappedObj;
}

function stack(array, iterator) {
    const results = [];
    const callback = isFunction(iterator) ? iterator :
        item => (isFunction(item) ? item() : item);

    let chain = Promise.resolve();
    array.forEach((item, index, arr) => {
        results.push(
            chain = chain.then(() => callback(item, index, arr))
        );
    });

    return Promise.all(results);
}

function spread(array, iterator) {
    const callback = isFunction(iterator) ? iterator :
        item => (isFunction(item) ? item() : item);

    return Promise.all(array.map(callback));
}

function move(array, currentIndex = 0, newIndex = 0) {
    const cloned = [...array];

    let adjustedIndex = 0;
    if (newIndex > 0) {
        if (newIndex >= cloned.length) {
            adjustedIndex = cloned.length;
        } else {
            adjustedIndex = newIndex;
        }
    }
    cloned.splice(adjustedIndex, 0, ...cloned.splice(currentIndex, 1));

    return cloned;
}

const ObjectUtils = {
    without,
    pick,
    hasNonEmptyValues,
    stringifyArrayValues,
    toURI,
    toParam,
    formatObject,
    pruneEmpties,
    mapEntries,
    getNestedProperty,
    nested: getNestedProperty
};

const ArrayUtils = {
    shuffle,
    flatten,
    intersect,
    move,
    uniqueMe,
    uniqueBy,
    stack,
    spread
};

function setObjectPrototypes() {
    Object.keys(ObjectUtils)
        .filter(prop => !Object.keys(Object.prototype).includes(prop))
        .forEach((prop) => {
            /* eslint func-names: "off" */
            Object.assign(Object.prototype, {
                [prop]: function(...args) {
                    return args.length ?
                        ObjectUtils[prop].apply(this, [this, ...args]) :
                        ObjectUtils[prop](this);
                }
            });
        });
}

function setArrayPrototypes() {
    Object.keys(ArrayUtils)
        .filter(prop => !Object.keys(Array.prototype).includes(prop))
        .forEach((prop) => {
            /* eslint func-names: "off" */
            Object.assign(Array.prototype, {
                [prop]: function(...args) {
                    return args.length ?
                        ArrayUtils[prop].apply(this, [this, ...args]) :
                        ArrayUtils[prop](this);
                }
            });
        });
}

Object.assign(exports, ObjectUtils, ArrayUtils, {
    arrayMe,
    dateMe,
    setArrayPrototypes,
    setObjectPrototypes
});

