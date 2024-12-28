from loan_payments.common import field_names, lookup


def validate_input_add_new_bank(inputs):
    flag = True
    msg = 'all good'
    name = inputs[field_names.name]
    if name == '' or len(name) > 10:
        msg = 'name is blank or length is more than 10 characters'
        flag = False
    else:
        obj = lookup.check_bank_exists(name=name)
        if obj[field_names.id] != -1:
            msg = f"record {name} already exists"
            flag = False

    return {field_names.status: flag, field_names.msg: msg}
