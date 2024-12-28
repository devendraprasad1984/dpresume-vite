import json

from django.shortcuts import HttpResponse as res
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view

from customer_manager import models
from loan_payments import params
from loan_payments.common import field_names, lookup, utils
from validations import validate as customerValidations


@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.post_], request_body=params.add_customer_req_body, manual_parameters=[params.param_signer_ref], operation_description=params.add_customer_desc)
@api_view([params.post_])
@utils.manager_check_signer_middleware()
def fn_add_customer(req):
    if req.method == 'GET':
        return res(utils.NO_OP_ALLOWED)

    body = utils.get_body_from_req(req)
    check_flag, msg = lookup.check_field_existence_in_request_body(body, [field_names.name, field_names.age, field_names.email, field_names.loan_limit])
    if check_flag == False: return res(msg, content_type=utils.CONTENT_TYPE)

    name = body[field_names.name]
    age = body[field_names.age]
    email = body[field_names.email]
    loan_limit = body[field_names.loan_limit]
    flag = True
    validate = customerValidations.validate_input_add_new_customer(body)
    if validate[field_names.status] == True:
        try:
            uid = utils.get_uniq_customerid()
            model = models.CUSTOMERS(
                name=name,
                uid=uid,
                age=age,
                email=email,
                loan_limit=loan_limit
            )
            model.save()
            utils.add_log(field_names.customer, body)
            success = {
                field_names.msg: f'customer {name}, {email}, {age} yrs, having loan {loan_limit} added - {uid}',
                field_names.status: utils.success
            }
        except Exception as ex:
            failed = {
                field_names.msg: f'customer {name} {email} not added',
                field_names.detail: str(ex),
                field_names.status: utils.failed
            }
            flag = False
            utils.add_error('customer error', str(ex))
    else:
        flag = False
        failed = {
            field_names.msg: f'{validate[field_names.msg]}',
            field_names.status: utils.failed
        }

    output = success if flag == True else failed
    return res(json.dumps(output), content_type=utils.CONTENT_TYPE)

@require_GET
@csrf_exempt
@swagger_auto_schema(methods=[params.get_], manual_parameters=[params.param_signer_ref], operation_description=params.get_customer_by_id_desc)
@api_view([params.get_])
@utils.manager_check_signer_middleware()
def fn_get_list_of_customers(req, id=None):
    if req.method == utils.POST:
        return res(utils.NO_OP_ALLOWED)
    output = lookup.run_customer_loan_query(**{"id": id})
    utils.add_log(field_names.customer, {'customer_fetch': True})
    return res(json.dumps(output), content_type=utils.CONTENT_TYPE)

@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.get_], manual_parameters=[params.param_signer_ref], operation_description=params.get_customer_by_loan_ref_desc)
@api_view([params.get_])
@utils.manager_check_signer_middleware()
def fn_get_customer_loan(req, loan_ref=None):
    if req.method == utils.POST:
        return res(utils.NO_OP_ALLOWED)
    output = lookup.run_customer_loan_query(**{field_names.loan_ref: loan_ref})
    utils.add_log(field_names.customer_with_loan, {'customer_fetch_loan_ref': True})
    return res(json.dumps(output), content_type=utils.CONTENT_TYPE)
