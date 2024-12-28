import labels from "./formlabels";
import routes from "./routes";
import app_messages from "./messages";
import consts from "./consts";

export const config = {
    appName: 'alphametrica',
    defaultUserName: 'test@luxpmsoft.com',
    defaultPassword: 'test1234!',
    route: routes,
    labels, app_messages, consts
}


export const notifyMe = (msg, autohide = true, callback) => {
    let iserr = msg.substring(0, 1) === '?'
    let msgNotifyInstance = new window.Notify({
        title: 'notification',
        status: iserr ? 'error' : 'success',
        text: iserr ? msg.substring(1) : msg,
        position: 'right bottom',
        customIcon: '',
        customClass: '',
        autoclose: autohide
    })
    setTimeout(() => {
        if (callback !== undefined) callback()
    }, 700)
}
