from loan_payments.common import field_names, lookup


def validate_input_add_new_customer(inputs):
    flag = True
    msg = 'all good'
    name = inputs[field_names.name]
    email = inputs[field_names.email]
    age = inputs[field_names.age]
    limit = inputs['loan_limit']
    if name == '' or email == '' or str(age).isnumeric() == False or str(limit).isnumeric() == False:
        msg = f'name/email is blank or invalid age/limit'
        flag = False
    else:
        obj = lookup.check_customer_exists(email=email)
        if obj[field_names.id] != -1:
            msg = f"record {email} already exists"
            flag = False

    return {field_names.status: flag, field_names.msg: msg}
