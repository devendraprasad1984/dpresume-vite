from loan_payments.common import field_names


def validate_input_add_new_loan(inputs):
    flag = True
    msg = 'all good'
    name = inputs[field_names.name]
    email = inputs[field_names.email]
    age = inputs[field_names.age]
    limit = inputs[field_names.limit]
    if name == '' or email == '' or str(age).isnumeric() == False or str(limit).isnumeric() == False:
        msg = f'invalid input'
        flag = False

    return {field_names.status: flag, field_names.msg: msg}
