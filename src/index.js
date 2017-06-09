const colorUtils = require('./color.util');
const cssCards = require('./css-cards');
const cssMixins = require('./css-mixins');
const eventUtils = require('./event.util');
const httpUtils = require('./http.util');
const isUtils = require('./is.util');
const logger = require('./logger');
const objectUtils = require('./obj.util');
const requestUtils = require('./req.util');
const stringUtils = require('./string.util');

class Utilitarian {
    constructor() {
        Object.assign(this, logger, {
            cards: cssCards,
            color: colorUtils,
            event: eventUtils,
            http: httpUtils,
            is: isUtils,
            mixins: cssMixins,
            obj: objectUtils,
            req: requestUtils,
            string: stringUtils
        });
    }
}

exports = new Utilitarian();

