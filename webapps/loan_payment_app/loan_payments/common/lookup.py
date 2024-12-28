import copy
import json

from

import field_names
import queries
import utils
from bank_manager import models as bank
from customer_manager import models as customer
from loan_manager import models as loan_model
from subscribe import models as subscriber


def check_field_existence_in_request_body(body, fld_names):
    presence_flag = True
    msg = copy.deepcopy(utils.MISSING_FIELD_MSG)
    flds_in_body = ', '.join(body) + ' | ' + body.__len__().__str__()
    flds_expected = ', '.join(fld_names) + ' | ' + fld_names.__len__().__str__()
    msg[field_names.expected] = flds_expected
    msg[field_names.given] = flds_in_body
    for f in fld_names:
        if f not in body or body[f] == '' or body[f] == None:
            presence_flag = False
            break
    return presence_flag, json.dumps(msg)


def check_bank_exists(name=None, uid=None, id=None):
    foundid = -1
    flag = True
    try:
        if name != None:
            found = bank.BANKS.objects.get(name=name)
        elif uid != None:
            found = bank.BANKS.objects.get(uid=uid)
        elif id != None:
            found = bank.BANKS.objects.get(id=id)

        foundid = found.id
    except bank.BANKS.DoesNotExist:
        found = None
        if found != None and found.id != None:
            flag = False
    return {field_names.id: foundid, field_names.name: name, field_names.status: flag, field_names.object: found}


def check_customer_all_loan(customer_id):
    flag = True
    try:
        found = loan_model.LOANS.objects.filter(customerid=customer_id)
        total_loan_amount = utils.get_sum(found, field_names.loan_amount)
        total_repaid_amount = utils.get_sum(found, field_names.repaid_amount)
        total_interest_amount = utils.get_sum(found, field_names.interest_amount)
    except loan_model.LOANS.DoesNotExist:
        found = None
        if found != None and found.id != None:
            flag = False
    return {
        field_names.customerid: customer_id,
        field_names.total_loan_amount: total_loan_amount,
        field_names.total_repaid_amount: total_repaid_amount,
        field_names.total_interest_amount: total_interest_amount,
        field_names.status: flag,
        field_names.object: found,
        field_names.count: len(found) if found != None else 0
    }


def check_customer_exists(email=None, uid=None, id=None):
    foundid = -1
    name = ''
    loan_limit = 0
    found_loan = None
    found = None
    flag = True
    try:
        if email != None:
            found = customer.CUSTOMERS.objects.get(email=email)
        elif uid != None:
            found = customer.CUSTOMERS.objects.get(uid=uid)
        elif id != None:
            found = customer.CUSTOMERS.objects.get(id=id)
        foundid = found.id
        name = found.name
        loan_limit = found.loan_limit
        found_loan = check_customer_all_loan(id)
    except customer.CUSTOMERS.DoesNotExist:
        if found != None and found.id != None:
            flag = False
    return {field_names.id: foundid, field_names.name: name, field_names.loan_limit: loan_limit, field_names.loan_calc: found_loan,
            field_names.status: flag, field_names.object: found}


def check_subscriber(email=None, secret_key=None):
    foundid = -1
    name = ''
    flag = True
    try:
        if email != None:
            found = subscriber.SUBSCRIPTION.objects.get(email=email)
        elif secret_key != None:
            found = subscriber.SUBSCRIPTION.objects.get(secret_key=secret_key)
        foundid = found.id
        name = found.name
    except subscriber.SUBSCRIPTION.DoesNotExist:
        found = None
        if found != None and found.id != None:
            flag = False
    return {field_names.id: foundid, field_names.name: name, field_names.status: flag, field_names.object: found}


def check_customer_or_bank_or_loan(id):
    if id == -1: return False
    return True


def get_existing_loan_details(bankid=None, customerid=None, loan_ref=None):
    id = -1
    uid = ''
    flag = True
    found_list = None
    try:
        if loan_ref != None and bankid == None and customerid == None:
            found = loan_model.LOANS.objects.filter(uid=loan_ref)
            found_list = utils.get_list(found)[0]
            id = found_list[field_names.id]
        elif loan_ref != None and bankid != None and customerid != None:
            found = loan_model.LOANS.objects.filter(bankid=bankid, customerid=customerid, uid=loan_ref)
            found_list = utils.get_list(found)[0]
            id = found_list[field_names.id]
            uid = found_list[field_names.uid]
        elif bankid == None and customerid == None:
            found = loan_model.LOANS.objects.filter(bankid=bankid, customerid=customerid)
            found_list = utils.get_json_set(found)
    except loan_model.LOANS.DoesNotExist:
        found = None
        if found != None and found.id != None:
            flag = False
    return {field_names.id: id, field_names.uid: uid, field_names.status: flag, field_names.object: found_list}


def run_customer_loan_query(**param):
    dataset = queries.custom_query_run(queries.get_customer_with_loan_query(**param))
    json_data = dataset[field_names.json]
    total_loan_offered = utils.get_sum_from_json_converted(json_data, field_names.loan_amount)
    loan_limit_left = -1
    is_id_ref = param[field_names.id] if field_names.id in param else ''
    is_loan_ref = param[field_names.loan_ref] if field_names.loan_ref in param else ''

    if json_data.__len__() > 0 and (is_id_ref or is_loan_ref):
        loan_limit = json_data[0][field_names.loan_limit]
        loan_limit_left = float(loan_limit) - total_loan_offered
    return {
        field_names.count: json_data.__len__(),
        field_names.total_loan_offered: f'{total_loan_offered:,}',
        field_names.loan_limit_left: f'{loan_limit_left:,}',
        field_names.data: json_data
    }
