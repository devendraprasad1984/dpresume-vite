import json
from functools import wraps

from django.shortcuts import HttpResponse as res

from loan_payments.common import field_names, lookup, utils


def check_signer_with_api_type(api_type=None):
    def check_signer(func):
        @wraps(func)
        def func_wrapper(*args, **kwargs):
            msg = utils.not_allowed
            req = args[0]
            has_body = req.body.__len__() != 0
            has_signer_key = utils.signer_header_key in req.headers
            signer_key_from_header = ''
            if has_signer_key:
                signer_key_from_header = req.headers[utils.signer_header_key]
            if has_body:
                body = utils.get_body_from_req(req)
                has_loan_ref = field_names.loan_ref in body

            unsigner = utils.get_unsigner_object(signer_key_from_header)
            subscribed = unsigner[field_names.subscription]
            allow_external_from_db = utils.get_field_values_from_model_object(subscribed, field_names.allow_external) if subscribed != None else False
            allow_crud_internal_from_db = utils.get_field_values_from_model_object(subscribed, field_names.allow_crud_internal) if subscribed != None else False
            api_type_in_db = utils.get_field_values_from_model_object(subscribed, field_names.type) if subscribed != None else False

            is_matched = unsigner[field_names.matched] and subscribed != None
            if api_type == field_names.external:
                allow_to_run = is_matched and allow_external_from_db == True and allow_crud_internal_from_db == False
            elif api_type == field_names.crud:
                allow_to_run = is_matched and allow_external_from_db == False and allow_crud_internal_from_db == True
            elif api_type == field_names.manager:
                allow_to_run = is_matched and api_type_in_db == field_names.manager
            elif api_type == field_names.borrower:
                allow_to_run = is_matched and api_type_in_db == field_names.borrower
                subscriber_email = utils.get_field_values_from_model_object(subscribed, field_names.email)
                email_match = False
                if has_loan_ref:
                    customer = lookup.run_customer_loan_query(**{field_names.loan_ref: body[field_names.loan_ref]})
                    customer_email = customer[field_names.data][0][field_names.email]
                    email_match = subscriber_email == customer_email
                    allow_to_run = is_matched and api_type_in_db == field_names.borrower and (has_loan_ref == True and email_match == True)

            output = {field_names.msg: msg, field_names.status: allow_to_run, field_names.api_type: api_type}
            if allow_to_run == False: return res(json.dumps(output), content_type=utils.CONTENT_TYPE)
            return func(*args, **kwargs)

        return func_wrapper

    return check_signer
