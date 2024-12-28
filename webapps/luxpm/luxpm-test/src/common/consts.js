const PWD_RULE = [
    'min 8 characters',
    'min 1 uppercase letter',
    'min 1 lowercase',
    'min 1 special character',
    'min 1 number',
]
const min_num_pwd = 8
const min_other_char = 1
const special_char_reg = new RegExp('([^!,%,&,@,#,$,^,*,?,_,~])', 'g')
const uppercase_reg = new RegExp('[^A-Z]', 'g')
const lowercase_reg = new RegExp('[^a-z]', 'g')
const numeric_reg = new RegExp('[^0-9]', 'g')
const email_reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const mobile_phone_reg = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/

const regs = {
    special_char_reg,
    uppercase_reg,
    lowercase_reg,
    numeric_reg,
    email_reg,
    mobile_phone_reg,
}
const consts = {PWD_RULE,  min_num_pwd, min_other_char, regs}

export default consts
