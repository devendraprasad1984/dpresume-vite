from loan_payments.common import field_names, lookup


def validate_input_subscribe(inputs):
    flag = True
    msg = 'all good'
    name = inputs[field_names.name]
    email = inputs[field_names.email]
    if name == '' or email == '':
        msg = f'invalid input'
        flag = False
    else:
        obj = lookup.check_subscriber(email=email)
        if obj[field_names.id] != -1:
            msg = f"record {email} already exists"
            flag = False

    return {field_names.status: flag, field_names.msg: msg}
