const {randomNumber} = require('./string.util');
const {pruneEmpties, pick} = require('./obj.util');

const colors = {
    white: '#FFFFFF',
    black: '#000000',
    platinum: '#E2E2E2',

    ltGrey: '#cacaca',
    mdGrey: '#666',
    dkGrey: '#333',
    mintCream: '#f5fbfc',
    paynesGrey: '#506381',
    outerSpace: '#4a4a4a',

    // reds
    pinkFieryRose: '#f7566d',
    fieryRose: '#ff5964',
    coralRed: '#ff3743',
    radicalRed: '#F23558',
    goldenGateBridge: '#C32F27',
    alabamaCrimson: '#b00018',
    heidelbergRed: '#a4001d',
    persianRed: '#D32F2F',

    // blues
    azureMist: '#f1fdff',
    ceil: '#86a6d1',
    rackleyBlue: '#6494AA',
    airSuperiorityBlue: '#7893BE',
    brilliantAzure: '#35a7ff',
    blueDeFrance: '#418CF0',
    newCar: '#255FDB',
    brightNavyBlue: '#1976D2',
    trueBlue: '#005CDB',
    richElectricBlue: '#129CDD',
    bdazzledBlue: '#2e5790',
    darkImperialBlue: '#1A3B69',
    deepKoamaru: '#213463',
    seaBlue: '#056492',
    metallicSeaweed: '#1B8896',
    moonstoneBlue: '#5EB1BF',
    queenBlue: '#476E84',

    // greens
    teaGreen: '#CEEDD2',
    shinyShamrock: '#61ae59',
    caribbeanGreen: '#02c39a',
    mayGreen: '#43A047',
    mughalGreen: '#27592E',
    smoke: '#6C806F',
    pearlAqua: '#80CBC4',

    // yellows
    buff: '#F3D288',
    paleSpringBud: '#F0F3BD',
    crayolaYellow: '#FFE382',
    bananaYellow: '#FFEE23',
    fluorescentOrange: '#FFBF00',
    meatBrown: '#F7B538',
    gargoyleGas: '#ffe743',

    // oranges
    sinopia: '#FCB441',
    redOrange: '#E0400A',
    darkTangerine: '#fcb813',
    copperRed: '#CA6B4B',
    melon: '#F1B9A8',
    fulvous: '#E0830A',

    // purples
    orchid: '#DA70D6',
    pictorialCarmine: '#C40863',
    jazzberryJam: '#B81365',
    htmlPurple: '#801B96',
    redViolet: '#C71585'
};

function intToHex(c) {
    const hex = c.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex({r, g, b}) {
    return `#${intToHex(r)}${intToHex(g)}${intToHex(b)}`;
}

function hexToRgb(hex = '') {
    const preResult = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) =>
        r + r + g + g + b + b
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(preResult);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function hexToRgba(hex = '', opacity = 0.6) {
    const {r, g, b} = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function randomRgb(overrides = {}) {
    return Object.assign({
        r: randomNumber(255),
        g: randomNumber(255),
        b: randomNumber(255)
    }, pruneEmpties(pick(overrides, ['r', 'g', 'b'])));
}

function randomRgba(opacity = 0.6, overrides = {}) {
    const {r, g, b} = randomRgb(overrides);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function randomHex(overrides = {}) {
    return rgbToHex(randomRgb(overrides));
}

function generateUniqueHexes(size = 1) {
    const hexKeys = new Set();

    while (hexKeys.size < size) {
        hexKeys.add(randomHex());
    }

    return Array.from(hexKeys);
}

function generateUniqueRgbs(size = 1, opacity = 1) {
    const rgbKeys = new Set();
    const createRgb = (opacity < 1 && opacity > 0) ?
        randomRgba.bind(null, opacity) :
        () => Object.values(randomRgb()).join('');

    while (rgbKeys.size < size) {
        rgbKeys.add(`${createRgb()}`);
    }

    return Array.from(rgbKeys);
}

function colorParse(color) {
    return (/^#|^rgb|^hsl/.test(color) ? color : `#${color}`);
}

Object.assign(exports, {
    colors,
    colorParse,
    generateUniqueHexes,
    generateUniqueRgbs,
    intToHex,
    rgbToHex,
    hexToRgb,
    hexToRgba,
    randomRgb,
    randomRgba,
    randomHex
});

