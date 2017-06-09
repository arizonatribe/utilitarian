const {pruneEmpties, mapEntries} = require('./obj.util');
const {isFunction} = require('./is.util');

function throttle(callback, windowSize = 50) {
    let throttleTimeout = 0;

    return (...args) => {
        if (throttleTimeout) {
            clearTimeout(throttleTimeout);
        }

        throttleTimeout = setTimeout(() => {
            if (isFunction(callback)) callback(...args);
            throttleTimeout = 0;
        }, windowSize || 0);
    };
}

function cancelEvent(event) {
    if (isFunction(event.stopPropagation)) {
        event.stopPropagation();
    }
    if (isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    if (event.nativeEvent && isFunction(event.nativeEvent.stopImmediatePropagation)) {
        event.nativeEvent.stopImmediatePropagation();
    }
}

function getTargetLocationAndDimensions(event, getCurrentTargetInstead = false) {
    const {clientX, clientY, target, currentTarget} = event;
    const {scrollX, scrollY} = window;
    const {id, style, nodeName, role, name} = (getCurrentTargetInstead ? currentTarget : target);
    const {top, left, bottom, right, width, height} = currentTarget.getBoundingClientRect();

    return pruneEmpties({
        clientX,
        clientY,
        top,
        left,
        bottom,
        right,
        width,
        height,
        id,
        nodeName,
        role,
        name,
        scrollX,
        scrollY,
        style: pruneEmpties(mapEntries(style))
    });
}

function getMouseLocation(event) {
    const {clientX, clientY, left, top} = getTargetLocationAndDimensions(event);

    return {
        x: clientX - left,
        y: clientY - top
    };
}

Object.assign(exports, {
    cancelEvent,
    throttle,
    getMouseLocation,
    getTargetLocationAndDimensions
});

