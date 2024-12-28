import {config, notifyMe} from "../common/config";

const signup_validation = (meta, pwdRuleCounter) => {
    console.log('signup meta', meta)
    const {email, password, confirmPassword, phone, name,dob} = config.labels

    if (
        meta[name.key] === ''
        || meta[phone.key] === ''
        || meta[dob.key] === ''
        || meta[email.key] === ''
        || meta[password.key] === ''
        || meta[confirmPassword.key] === ''
    ) {
        notifyMe(config.app_messages.missing_input)
        return false
    }


    if (config.consts.regs.email_reg.test(meta[email.key]) === false) {
        notifyMe(config.app_messages.incorrect_email)
        return false
    }

    if (config.consts.regs.mobile_phone_reg.test(meta[phone.key]) === false) {
        notifyMe(config.app_messages.incorrect_mobile_number)
        return false
    }

    let checkPwdRules = Object.values(pwdRuleCounter).filter(x => x === true)
    if (checkPwdRules.length !== config.consts.PWD_RULE.length || meta[password.key] === '') {
        notifyMe(config.app_messages.password_complexity_not_matched)
        return false
    }

    if (meta[confirmPassword.key] !== meta[password.key]) {
        notifyMe(config.app_messages.pwd_confirm_not_ok)
        return false
    }
    return true
}

export default signup_validation
