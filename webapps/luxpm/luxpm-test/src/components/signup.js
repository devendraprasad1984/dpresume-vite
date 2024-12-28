import React, {useState, useCallback} from 'react'
import HeaderName from "./headerName";
import Input from "../common/input";
import {config, notifyMe} from "../common/config";
import {useHistory} from "react-router-dom";
import signup_validation from "../validations/signup_validation";

const defaultPwdRule = {0: false, 1: false, 2: false, 3: false, 4: false}
const {name, dob, phone, email, password, confirmPassword, signup, login, subscribe} = config.labels
const {signup_opt1, signup_opt2, signup_opt3, signup_opt4} = config.labels
const defaults = {
    [name.key]: '',
    [dob.key]: '',
    [phone.key]: '',
    [email.key]: '',
    [password.key]: '',
    [confirmPassword.key]: '',
    [subscribe.key]: false,
    [signup_opt1.key]: false,
    [signup_opt2.key]: false,
    [signup_opt3.key]: false,
    [signup_opt4.key]: false
}

const SignUp = props => {
    const [meta, setMeta] = useState({...defaults})
    const [pwdruleCounter, setPwdRuleCounter] = useState({...defaultPwdRule})
    const history = useHistory()
    const {name, dob, phone, email, password, confirmPassword, signup, login, subscribe} = config.labels
    const {signup_opt1, signup_opt2, signup_opt3, signup_opt4} = config.labels

    const checkForPasswordRules = (pwdval) => {
        let tmp = {...pwdruleCounter}
        tmp[0] = pwdval.length >= config.consts.min_num_pwd ? true : false
        tmp[1] = (pwdval.replace(config.consts.regs.uppercase_reg, "").length >= config.consts.min_other_char) ? true : false
        tmp[2] = (pwdval.replace(config.consts.regs.lowercase_reg, "").length >= config.consts.min_other_char) ? true : false
        tmp[3] = (pwdval.replace(config.consts.regs.special_char_reg, "").length >= config.consts.min_other_char) ? true : false
        tmp[4] = (pwdval.replace(config.consts.regs.numeric_reg, "").length >= config.consts.min_other_char) ? true : false
        setPwdRuleCounter({...tmp})
    }
    const handleChange = e => {
        let {name, value, type, checked} = e.target
        let isCheckbox = (type === 'checkbox')
        let tmp = {}
        tmp[name] = isCheckbox === false ? value : (checked || false)
        setMeta({...meta, ...tmp})
        if (name === password.key) checkForPasswordRules(value)
    }
    const handleShowPasswordRule = useCallback(() => {
        return config.consts.PWD_RULE.map((x, i) => {
            return <div key={`pwdrule${i}`} className={pwdruleCounter[i] === true ? `xgreen` : `xred`}>{x}</div>
        })
    }, [pwdruleCounter])
    const handleSignUp = () => {
        if (signup_validation(meta, pwdruleCounter) === false) return
        notifyMe(config.app_messages.signup_completion)
    }
    const handleLogin = () => {
        history.push(config.route.login.key)
    }
    return <>
        <div className='col'>
            <HeaderName/>
            <div className='heading margin20'>Sign Up</div>
            <Input label={name.name} name={name.key} placeholder={name.placeholder} onchange={handleChange}/>
            <Input label={phone.name} name={phone.key} placeholder={phone.placeholder} onchange={handleChange}/>
            <Input type='date' format='MM-DD-YYYY' label={dob.name} name={dob.key} placeholder={dob.placeholder} onchange={handleChange}/>
            <Input label={email.name} name={email.key} placeholder={email.placeholder} onchange={handleChange}/>
            <Input type='password' label={password.name} name={password.key} placeholder={password.placeholder} onchange={handleChange}/>
            <div className='left size10'>{handleShowPasswordRule()}</div>
            <Input type='password' label={confirmPassword.name} name={confirmPassword.key} placeholder={confirmPassword.placeholder} onchange={handleChange}/>
            <br/>
            <div className='flexbox-2-row'>
                <Input classname='checkbox-round' type='checkbox' label={signup_opt1.name} name={signup_opt1.key} placeholder={signup_opt1.placeholder} onchange={handleChange}/>
                <Input classname='checkbox-round' type='checkbox' label={signup_opt2.name} name={signup_opt2.key} placeholder={signup_opt2.placeholder} onchange={handleChange}/>
                <Input classname='checkbox-round' type='checkbox' label={signup_opt3.name} name={signup_opt3.key} placeholder={signup_opt3.placeholder} onchange={handleChange}/>
                <Input classname='checkbox-round' type='checkbox' label={signup_opt4.name} name={signup_opt4.key} placeholder={signup_opt4.placeholder} onchange={handleChange}/>
            </div>
            <br/>
            <Input classname='checkbox' type='checkbox' label={subscribe.name} name={subscribe.key} placeholder={subscribe.placeholder} onchange={handleChange}/>
            <br/>
            <span className='btn' onClick={handleSignUp}>{signup.name}</span>
            <div>
                <span>already a user? <span className='link labelx' onClick={handleLogin}>{login.name}</span></span>
            </div>
        </div>
    </>
}

export default SignUp
