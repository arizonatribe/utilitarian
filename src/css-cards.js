const cardWidth = '80%';
const spacingBetweenCards = '1em';
const largeWidth = '98%';

Object.assign(exports, {
    cardWidth,
    largeWidth,
    spacingBetweenCards,
    after: {
        marginBottom: spacingBetweenCards
    },
    base: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    before: {
        marginTop: spacingBetweenCards
    },
    cardBackgroundColor: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    fullHeight: {
        height: '100%'
    },
    width: {
        '@media only screen and (min-width: 720px)': {
            maxWidth: cardWidth,
            minWidth: cardWidth
        }
    },
    widthPhone: {
        '@media only screen and (min-width: 320px)': {
            maxWidth: '98%',
            minWidth: '98%'
        }
    },
    widthTablet: {
        '@media only screen and (min-width: 480px)': {
            maxWidth: '95%',
            minWidth: '95%'
        }
    }
});

