from drf_yasg import openapi

from loan_payments.common import field_names, utils


post_ = utils.POST
get_ = utils.GET
put_ = 'PUT'
delete_ = 'DELETE'

type_string = openapi.Schema(type=openapi.TYPE_STRING)
type_integer = openapi.Schema(type=openapi.TYPE_INTEGER)
type_number = openapi.Schema(type=openapi.TYPE_NUMBER)
type_object = openapi.TYPE_OBJECT

param_signer_ref = openapi.Parameter(utils.signer_header_key, in_=openapi.IN_HEADER, description=f'provide signer key, make sure to provide relevant ({field_names.manager} or {field_names.borrower} signed keys)', type=openapi.TYPE_STRING)

subscription_req_desc = 'subscription to borrower or manager to operating on api'
subscription_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.name, field_names.email, field_names.type],
    properties={
        field_names.name: type_string,
        field_names.email: type_string,
        field_names.type: type_string
    },
)

subscription_list_desc = 'get details of all subscribers'
bank_list_desc = 'get details of all banks registered for loan offering'

new_jwt_req_desc = 'get new jwt token acting as refreshing token whose expiry needs to be checked'
new_jwt_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.user],
    properties={
        field_names.user: type_string,
    },
)

add_bank_desc = f'provide bank name to create bank as entity and provide {field_names.manager} signer key'
add_bank_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.name],
    properties={
        field_names.name: type_string,
    },
)

add_customer_desc = f'create customer and provide {field_names.manager} signer key'
add_customer_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.name, field_names.age, field_names.email, field_names.loan_limit],
    properties={
        field_names.name: type_string,
        field_names.age: type_integer,
        field_names.email: type_string,
        field_names.loan_limit: type_number,
    },
)
get_customer_by_id_desc = f'get customer details by id and provide {field_names.manager} signer key'
get_customer_by_loan_ref_desc = f'get customer details by loan_ref and provide {field_names.manager} signer key'

add_loan_desc = f'create loan for specific customer (unique identified by already created in system by email id) from particular bank and provide {field_names.manager} signer key'
add_loan_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.bank_name, field_names.email, field_names.loan_amount, field_names.rate, field_names.year],
    properties={
        field_names.bank_name: type_string,
        field_names.email: type_string,
        field_names.loan_amount: type_number,
        field_names.rate: type_number,
        field_names.year: type_integer,
    },
)

get_loan_balance_desc = f'get loan details for specific customer and and provide {field_names.borrower} signer key'
get_loan_balance_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.bank_name, field_names.email, field_names.loan_ref, field_names.emi_number],
    properties={
        field_names.bank_name: type_string,
        field_names.email: type_string,
        field_names.loan_ref: type_string,
        field_names.emi_number: type_integer,
    },
)

set_loan_payment_desc = f'make loan payments for specific customer and his loan and and provide {field_names.borrower} signer key'
set_loan_payment_req_body = openapi.Schema(
    type=type_object,
    required=[field_names.loan_ref, field_names.payment, field_names.emi_number],
    properties={
        field_names.loan_ref: type_string,
        field_names.payment: type_number,
        field_names.emi_number: type_integer,
    },
)
