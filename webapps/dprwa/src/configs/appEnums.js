const appConfig={
    title:'title',
    meta_name:'meta_name',
    meta_description:'meta_description',
    heading_line2:'heading_line2',
    heading_line3:'heading_line3',
    whatsapp:'whatsapp',
    key_contacts_line1:'key_contacts_line1',
    key_contacts_line2:'key_contacts_line2',
    key_contacts_line3:'key_contacts_line3',
    app_sign_line1:'app_sign_line1',
    app_sign_line2:'app_sign_line2',
    app_sign_line3:'app_sign_line3',
    logo:'logo',
    memberType:'member_type'
}

const payloadEnums={
    addMember: 'addMember',
    saveContribution:'saveContribution',
    saveExpense:'saveExpense',
    loginCheck:'loginCheck',
    passwordChange:'passwordChange',
    deleteMember:'deleteMember',
    deleteExpense:'deleteExpense'
}

const appGlobal={
    app: "app",
    home: "home",
    education: "education",
    experience: "experience",
    projects: "projects",
    certificate: "certificate",
    skills: "skills",
    achievement: "achievement",
    basicDisplay: "basicDisplay",
    bottomBar: "bottomBar",
    headerInfo: "headerInfo",
    htmlComponent: "htmlComponent",
    nav: "nav",
    input: "input",
    nodata_ok: "nodata_ok",
    nodata_404: "nodata_404",
    onelinerHeader: "onelinerHeader",
    articles: "articles",

    appLink: 'https://dpresume.com/rwa8',
    isAdmin: 'isAdmin',
    loginName: 'loginName',
    userid: 'userid',
    isLogin: 'isLogin',
    member: 'member',
    admin: 'admin',
    president: 'president',
    treasurer: 'treasurer',
    logout: 'Logout',
    login: 'Login',
    none: 'none',
    block: 'block',
    byname: 'byname',
    byamount: 'byamount',
    byaddress: 'byaddress',
    byexpense: 'byexpense',
    homefilter: 'homefilter',

    exclusiveKeys: ['credits','expenses', 'members'],
    homeBadges: ["Simplicity", "Together", "Better", "Society"],
    ...appConfig,
    payloadEnums
}

const WorkerEnums = {
    GET_DATA_FROM_API: 'GET_DATA_FROM_API'
}
const webWorkerPath={
    pullApiPath:'../webworkers/pullApiWorker.js'
}
const login = {
    pageTitle: "Login to RWAce"
}
const AppEnums = {
    ...{appGlobal, ...WorkerEnums,...webWorkerPath}
    , ...{login: {...login}}
};
export default AppEnums;
