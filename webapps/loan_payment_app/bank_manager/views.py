import json

from django.shortcuts import HttpResponse as res
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view

from bank_manager import models
from loan_payments import params
from loan_payments.common import field_names, lookup, utils
from validations import validate as bankValidations


@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.post_], request_body=params.add_bank_req_body, manual_parameters=[params.param_signer_ref], operation_description=params.add_bank_desc)
@api_view([params.post_])
@utils.manager_check_signer_middleware()
def fn_add_bank(req):
    if req.method == utils.GET:
        return res(utils.NO_OP_ALLOWED)
    body = utils.get_body_from_req(req)
    check_flag, msg = lookup.check_field_existence_in_request_body(body, [field_names.name])
    if check_flag == False: return res(msg, content_type=utils.CONTENT_TYPE)

    name = body[field_names.name]
    flag = True
    validate = bankValidations.validate_input_add_new_bank(body)
    if validate[field_names.status] == True:
        try:
            uid = utils.get_uniq_bankid()
            model = models.BANKS(name=name, uid=uid)
            model.save()
            utils.add_log(field_names.banks, body)
            success = {
                field_names.msg: f'bank {name} added - {uid}',
                field_names.status: utils.success
            }
        except Exception as ex:
            failed = {
                field_names.msg: f'bank {name} not added',
                field_names.detail: str(ex),
                field_names.status: utils.failed
            }
            flag = False
            utils.add_error('bank error', str(ex))
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
@swagger_auto_schema(methods=[params.get_], manual_parameters=[params.param_signer_ref], operation_description=params.bank_list_desc)
@api_view([params.get_])
@utils.manager_check_signer_middleware()
def fn_get_list_of_banks(req):
    if req.method == utils.POST:
        return res(utils.NO_OP_ALLOWED)
    data = utils.get_json_set(models.BANKS.objects.only(field_names.id, field_names.name, field_names.uid, field_names.when).order_by(field_names.id))
    output = {'data': data}
    utils.add_log(field_names.banks, {'bank_fetch': True})
    return res(json.dumps(output), content_type=utils.CONTENT_TYPE)
