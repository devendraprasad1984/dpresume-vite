import getHost from "./gethost";
import {Dimensions} from "react-native";

let apiPrefix = getHost();
let appuri = 'SANSKAR_SERVER/api/endpoints';
let endpointPrefix = apiPrefix + appuri;

export const Config = {
    voicey: 'https://dpresume.com/sanskar/voicey/'
    , bannerEndpoint: endpointPrefix + '/banner.php'
    , offerEndpoint: endpointPrefix + '/offer.php'
    , configEndPoint: endpointPrefix + '/config.php'
    , iconsEndpoint: endpointPrefix + '/icons.php'
    , saveSupportQueryEndpoint: endpointPrefix + '/saveSupportQueries.php'
    , getSupportQueriesEndpoint: endpointPrefix + '/getSupportQueries.php'
    , agentValidator: endpointPrefix + '/agentValidator.php'
    , forgotCode: endpointPrefix + '/forgotAgentCode.php'
    , productsEndPoint: endpointPrefix + '/products.php'
    , orderSaveEndpoint: endpointPrefix + '/orderSave.php'
    , cancelOrderEndpoint: endpointPrefix + '/cancelOrders.php'
    , getOrderEndpoint: endpointPrefix + '/getOrders.php'
    , helpScreenEndpoint: endpointPrefix + '/helpscreens.php'
    , orderUploaderEndpoint: endpointPrefix + '/orderUploader.php'
    , orderImagesEndpoint: endpointPrefix + '/getOrderImages.php'
    , addressEndpoint: endpointPrefix + '/getAddress.php'
    , deliverOrderEndpoint: endpointPrefix + '/deliverOrder.php'
}


export const Enum = {
    rupee: '₹',
    perc: '%',
    MedLoader: require('../../assets/load1.gif'),
    logo: require('../../assets/icon.png'),
    successMsg: 'success',
    failedMsg: 'failed',
    validateMss: 'wrong guid code, agent cannot be validated',
    forgotMailSuccessMsg: 'forgot email has been sent',
    forgotMailFailMsg: 'contact admin, your code cant be sent, make sure you have entered correct agent code registered with us',
    reorderSuccessMsg: 'order has been placed successful',
    reorderCancelMsg: 'order has been cancelled, thanks for dealing with us',
    viewType: {
        agent: 'agent'
        , delivery: 'delivery'
        , shipper: 'shipper'
        , warehouse: 'warehouse'
        , retailer: 'retailer'
    },
    orderState: {
        pending: 'pending',
        success: 'success',
        transit: 'transit',
        hold: 'hold',
        shipped: 'shipped',
        delivered: 'delivered',
        cancelled: 'cancelled',
        warehouse: 'warehouse'
    },
    screenName: {
        ads: 'Adrotator'
        , category: 'Category'
        , splash: 'Splash'
        , home: 'Home'
        , support: 'Support'
        , orderHistory: 'OrderHistory'
        , setting: 'Settings'
        , mainAppNav: 'SimpleNav'
        , events: 'Events'
        , blogs: 'Blogs'
        , userProfile: 'UserProfile'
        , helpSplash: 'HelpSplash'
        , offers: 'Offers'
        , catalogue: 'Catalogue'
        , fillorder: 'FillOrder'
        , orderscanner: 'OrderScanner'
        , topAppname: 'TopAppname'
        , moreOptions: 'MoreOptions'
        , cart: 'Cart'
        ,deliverOrder:'DeliverOrder'
    }
    , maxwidth: Dimensions.get('window').width - 10
    , colorTypes: {success: 'success', danger: 'danger', warning: 'warning', default: 'default'}
    , success: 'success'
    , iconSize: 20
    , txtSize: 15,
    lavender: '#E6E6FA',
    thistle: '#D8BFD8',
    plum: '#DDA0DD',
    orchid: '#DA70D6',
    violet: '#EE82EE',
    fuchsia: '#FF00FF',
    magenta: '#FF00FF',
    mediumOrchid: '#BA55D3',
    darkOrchid: '#9932CC',
    darkViolet: '#9400D3',
    blueViolet: '#8A2BE2',
    darkMagenta: '#8B008B',
    purple: '#800080',
    mediumPurple: '#9370DB',
    mediumSlateBlue: '#7B68EE',
    slateBlue: '#6A5ACD',
    darkSlateBlue: '#483D8B',
    rebeccaPurple: '#663399',
    indigo: '#4B0082',
    lightSalmon: '#FFA07A',
    salmon: '#FA8072',
    darkSalmon: '#E9967A',
    lightCoral: '#F08080',
    indianRed: '#CD5C5C',
    crimson: '#DC143C',
    red: '#FF0000',
    fireBrick: '#B22222',
    darkRed: '#8B0000',
    orange: '#FFA500',
    darkOrange: '#FF8C00',
    coral: '#FF7F50',
    tomato: '#FF6347',
    orangered: '#FF4500',
    gold: '#FFD700',
    yellow: '#FFFF00',
    lightYellow: '#FFFFE0',
    lemonChiffon: '#FFFACD',
    papayaWhip: '#FFEFD5',
    moccasin: '#FFE4B5',
    peachPuff: '#FFDAB9',
    paleGoldenRod: '#EEE8AA',
    khaki: '#F0E68C',
    darkKhaki: '#BDB76B',
    greenYellow: '#ADFF2F',
    chartreuse: '#7FFF00',
    lawnGreen: '#7CFC00',
    lime: '#00FF00',
    limeGreen: '#32CD32',
    paleGreen: '#98FB98',
    lightGreen: '#90EE90',
    mediumSpringGreen: '#00FA9A',
    springGreen: '#00FF7F',
    mediumSeaGreen: '#3CB371',
    seaGreen: '#2E8B57',
    forestGreen: '#228B22',
    green: '#008000',
    darkGreen: '#006400',
    yellowGreen: '#9ACD32',
    oliveDrab: '#6B8E23',
    darkOliveGreen: '#556B2F',
    mediumAquaMarine: '#66CDAA',
    darkSeaGreen: '#8FBC8F',
    lightSeaGreen: '#20B2AA',
    darkCyan: '#008B8B',
    teal: '#008080',
    aqua: '#00FFFF',
    cyan: '#00FFFF',
    lightCyan: '#E0FFFF',
    paleTurquoise: '#AFEEEE',
    aquamarine: '#7FFFD4',
    turquoise: '#40E0D0',
    mediumTurquoise: '#48D1CC',
    darkTurquoise: '#00CED1',
    cadetBlue: '#5F9EA0',
    steelBlue: '#4682B4',
    lightSteelBlue: '#B0C4DE',
    lightBlue: '#ADD8E6',
    powderBlue: '#B0E0E6',
    lightSkyBlue: '#87CEFA',
    skyBlue: '#87CEEB',
    cornflowerBlue: '#6495ED',
    deepSkyBlue: '#00BFFF',
    dodgerBlue: '#1E90FF',
    royalBlue: '#4169E1',
    blue: '#0000FF',
    mediumBlue: '#0000CD',
    darkBlue: '#00008B',
    navy: '#000080',
    midnightBlue: '#191970',
    cornsilk: '#FFF8DC',
    blanchedAlmond: '#FFEBCD',
    bisque: '#FFE4C4',
    navajoWhite: '#FFDEAD',
    wheat: '#F5DEB3',
    burlyWood: '#DEB887',
    tan: '#D2B48C',
    rosyBrown: '#BC8F8F',
    sandyBrown: '#F4A460',
    goldenRod: '#DAA520',
    darkGoldenRod: '#B8860B',
    peru: '#CD853F',
    chocolate: '#D2691E',
    olive: '#808000',
    saddleBrown: '#8B4513',
    sienna: '#A0522D',
    brown: '#A52A2A',
    maroon: '#800000',
    snow: '#FFFAFA',
    honeyDew: '#F0FFF0',
    mintCream: '#F5FFFA',
    azure: '#F0FFFF',
    aliceBlue: '#F0F8FF',
    ghostWhite: '#F8F8FF',
    whiteSmoke: '#F5F5F5',
    seaShell: '#FFF5EE',
    beige: '#F5F5DC',
    oldLace: '#FDF5E6',
    floralWhite: '#FFFAF0',
    ivory: '#FFFFF0',
    antiqueWhite: '#FAEBD7',
    linen: '#FAF0E6',
    lavenderBlush: '#FFF0F5',
    mistyRose: '#FFE4E1',
    gainsboro: '#DCDCDC',
    lightGray: '#D3D3D3',
    silver: '#C0C0C0',
    darkGray: '#A9A9A9',
    dimGray: '#696969',
    gray: '#808080',
    lightSlateGray: '#778899',
    slateGray: '#708090',
    darkSlateGray: '#2F4F4F',
    white: '#ffffff',
    black: '#000000',
    configKeys: {
        logo: 'logo',
        contactus: 'Contact-Us',
        facebook: 'facebook',
        whatsapp: 'whatsapp',
        twiter: 'twitter',
        linkedin: 'linkedin',
        blogs: 'main-blog',
        splashtxt: 'SplashText',
        splashimg: 'SplashImg',
        getevent: 'events',
        appText: 'app-text',
        appColor: 'app-color',
        licence: 'licence',
        tagline: 'tagline',
        btnColor: 'btnColor',
        btnTextColor: 'btnTextColor',
    }
}

export const filterByKey = (data, key) => {
    // if(data===undefined) return {value:'not found'};
    return data.filter(x => x.key === key)[0]
}
export const getdate = (dt) => {
    if(dt===null || dt==='') return ''

    let newdate = new Date(dt)
    newdate = dt.substring(0, 10)
    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    let tmp = newdate.split('-')
    // newdate=tmp[2]+'.'+months[parseInt(tmp[1])]+'.'+tmp[0]
    newdate = tmp[2] + '.' + tmp[1] + '.' + tmp[0]
    // console.log(dt, newdate )
    return newdate
}
