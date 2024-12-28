import {Platform, StatusBar, StyleSheet} from "react-native";
import {Enum} from "./Config";
// import {connect} from 'react-redux'

const defaultColor = Enum.black;

export const appColor = (color) => {
    return {
        color: (color === undefined || color === '' ? defaultColor : color)
    }
}
// export default connect(state=>{color: state.config.color})(appColor)

export const bgColor = (color) => {
    return {
        backgroundColor: (color === undefined || color === '' ? defaultColor : color)
    }
}

export const CSS = StyleSheet.create({
    xview: {
        flex: 1
        , margin: 7
        , padding: 5
        , backgroundColor: Enum.white
    },
    headerLine: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    modalView: {
        textAlign: "center",
        zIndex: 9999,
    },
    modalContainer: {
        flex: 1,
        // position:'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        bottom: 0
    },
    modalViewCenter: {
        zIndex: 9999,
        height: undefined,
        // width: Enum.maxwidth,
        padding: 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
    },
    heading: {
        fontSize: 14,
        fontWeight: 'bold',
    }, subheading: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    line: {
        borderBottomWidth: 2,
        marginBottom: 2,
        color: Enum.gray,
        opacity: 0.4
    },
    splashFirstTxt: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    splashSecondTxt: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Enum.gray,
        textAlign: 'right'
    },
    splashThirdTxt: {
        fontSize: 9,
        fontWeight: 'bold',
        color: Enum.purple,
        textAlign: 'right'
    }
    , center: {
        justifyContent: 'center'
        , alignItems: 'center'
    },
    buttonsRow: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    bgWhite: {
        backgroundColor: 'white'
    },
    safeAreaContainer: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Enum.white,
        flexDirection: 'column',
        height: undefined,
        paddingTop: Platform.OS.toLowerCase() === 'android' ? StatusBar.currentHeight : 0
    },
    para: {
        fontSize: 13,
        padding: 10,
        textAlign: 'justify'
    },
    BottomNavContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexRow: {
        flex: 0.12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'space-around',
    },
    inrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        // padding: 1.5,
    },
    flexColumn: {
        flex: 0.1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    }, xheight: {
        height: 150
    }, xmargin: {
        marginLeft: 5,
    }, iconImg: {
        width: 70,
        height: 70,
        margin: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        resizeMode: 'contain',
        alignSelf: 'stretch'
    }, iconImageView: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 20,
    }, iconText: {
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center'
    }, fitImage: {
        height: '100%',
        width: Enum.maxwidth,
        resizeMode: 'contain',
        alignSelf: 'stretch'
    }, ordimg: {
        height: 400,
        width: Enum.maxwidth - 10,
        resizeMode: 'cover',
        alignSelf: 'stretch',
        marginBottom: 10
    }, imgx: {
        height: 70,
        width: 90,
        resizeMode: 'contain',
    }, adsContainer: {
        marginTop: 10,
        // width: '100%',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    imgVid: {
        height: 230
        , margin: 5
        , width: Enum.maxwidth
        , resizeMode: 'cover'
    },
    gap: {
        marginTop: 2,
        marginBottom: 2
    },
    textContainer: {
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    rightAlign: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'space-around',
    },
    scrollText: {
        textAlign: 'justify',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    }
    ,
    splashImage: {height: 150, width: 150},
    bottom: {
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        // padding: 10,
        // position:'absolute',
        bottom: 0,
        right: 0,
    },
    right: {
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right',
        justifyContent: 'flex-end'
    },
    top: {
        padding: 10,
        top: 0,
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Enum.white
    }, dot: {
        backgroundColor: Enum.purple,
        width: 7,
        height: 7,
        borderRadius: 5,
        margin: 4,
        bottom: 0,
    }
    , activedot: {
        backgroundColor: Enum.orange,
        width: 7,
        height: 7,
        borderRadius: 5,
        margin: 3,
    }, iconView: {
        fontSize: 20,
        height: 30,
        width: 40
    }, card: {
        height: undefined,
        width: '100%',
        marginVertical: 3,
        flexDirection: 'row',
        shadowRadius: 2,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
    cardInfo: {
        flex: 1,
        height: undefined,
        padding: 3,
        borderColor: appColor().color || Enum.purple,
        borderWidth: 2,
        borderRadius: 8,
    },
    cardDetails: {
        fontSize: 10,
        flexWrap: 'wrap'
    },
    button: {
        borderWidth: 1.5,
        borderRadius: 7,
        paddingVertical: 1,
        paddingHorizontal: 5,
        margin: 1,
        alignItems: 'center'
    },
    bottomx: {
        flex: 1,
        bottom:0,
        width:'100%',
        // justifyContent: 'flex-end',
        marginBottom: 5,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})
