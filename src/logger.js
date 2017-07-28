const isUtils = require('./is.util');

const {isNullOrUndefined} = isUtils;

/**
 * Wrapper for the `console.log`, `console.debug`, `console.error`, etc.,
 * functions, but allows turn debug/info/log events on or off.
 * @name utilitarian.logger
 * @class
 * @constructor
 */
class Logger {
    constructor(consoleObj) {
        this.loggingEnabled = true;
        this.console = consoleObj || console;
    }

    log(...messages) {
        if (this.loggingEnabled) messages.forEach(m => !isNullOrUndefined(m) && this.console.log(m));
    }

    debug(...messages) {
        if (this.loggingEnabled) messages.forEach(m => !isNullOrUndefined(m) && this.console.debug(m));
    }

    info(...messages) {
        if (this.loggingEnabled) messages.forEach(m => !isNullOrUndefined(m) && this.console.info(m));
    }

    error(...errors) {
        errors.forEach(m => (
            m.stack ?
            this.console.error(`${m.message ? `${m.message}\n` : ''}${m.stack}`) :
            this.console.error(m)
        ));
    }

    warn(...warnings) {
        warnings.forEach(m => !isNullOrUndefined(m) && this.console.warn(m));
    }
}

exports.logger = new Logger();

