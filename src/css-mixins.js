const {colors, colorParse} = require('./color.util');

const {ltGrey} = colors;

Object.assign(exports, {
    boxShadowInset: (color = ltGrey, x = 0, y = 0, blur = '3px') => ({
        boxShadow: `inset ${x} ${y} ${blur} ${colorParse(color)}`
    }),
    boxShadow: (color = ltGrey, x = 0, y = 0, blur = '3px') => ({
        boxShadow: `${x} ${y} ${blur} ${colorParse(color)}`
    }),
    boxShadowInsetOutset: (color = ltGrey, x = 0, y = 0, blur = '3px') => ({
        boxShadow: `inset ${x} ${y} ${blur} ${colorParse(color)}, ${x} ${y} ${blur} ${colorParse(color)}`
    }),
    transition: (cssProperty = 'all', duration = '0.2s', timing = 'ease') => ({
        transition: `${cssProperty} ${duration} ${timing}`
    })
});

