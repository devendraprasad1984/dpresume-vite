import {config, notifyMe} from "../common/config";

const login_validation = (meta) => {
    console.log('login meta', meta)
    const {email, password} = config.labels

    if (
       meta[email.key] === ''
        || meta[password.key] === ''
    ) {
        notifyMe(config.app_messages.missing_input)
        return false
    }

    if (config.consts.regs.email_reg.test(meta[email.key]) === false) {
        notifyMe(config.app_messages.incorrect_email)
        return false
    }
    if (meta[email.key] !== config.defaultUserName || meta[password.key]  !== config.defaultPassword) {
        notifyMe(config.app_messages.failed_login)
        return false
    }


    return true
}

export default login_validation
