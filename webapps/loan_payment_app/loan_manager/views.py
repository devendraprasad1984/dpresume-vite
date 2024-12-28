import json

from
from django.shortcuts import HttpResponse as res
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view

import models
from loan_payments import params
from loan_payments.common import field_names, lookup, utils


msg_entity_doesnt_exist = {
    field_names.msg: f'bank | customer | loan or all association doesnt exist',
    field_names.status: False
}


@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.post_], request_body=params.add_loan_req_body, manual_parameters=[params.param_signer_ref],
                     operation_description=params.add_loan_desc)
@api_view([params.post_])
@utils.manager_check_signer_middleware()
def fn_loan(req):
    if req.method == utils.GET:
        return res(utils.NO_OP_ALLOWED)
    body = utils.get_body_from_req(req)
    check_flag, msg = lookup.check_field_existence_in_request_body(body, [field_names.bank_name, field_names.email, field_names.loan_amount,
                                                                          field_names.rate, field_names.year])
    if check_flag == False: return res(msg, content_type=utils.CONTENT_TYPE)

    bank_name = body[field_names.bank_name]
    email = body[field_names.email]
    loan_amount = body[field_names.loan_amount]
    rate = body[field_names.rate]
    period = body[field_names.year]

    bank = lookup.check_bank_exists(name=bank_name)
    customer = lookup.check_customer_exists(email=email)
    bankid = bank[field_names.id]
    customerid = customer[field_names.id]
    bank_entity_exist_check = lookup.check_customer_or_bank_or_loan(bankid)
    customer_entity_exist_check = lookup.check_customer_or_bank_or_loan(customerid)
    if bank_entity_exist_check == False or customer_entity_exist_check == False:
        return res(json.dumps(msg_entity_doesnt_exist), content_type=utils.CONTENT_TYPE)

    found_bank_object = bank[field_names.object]
    customername = customer[field_names.name]
    loan_limit = customer[field_names.loan_limit]
    found_customer_object = customer[field_names.object]
    customer_loan_calci = customer[field_names.loan_calc]
    total_number_of_loans = customer_loan_calci[field_names.count]
    total_loaned_value = customer_loan_calci[field_names.total_loan_amount]
    credit_loan_left = float(loan_limit) - total_loaned_value
    cannot_sanction_loan = credit_loan_left < loan_amount
    if cannot_sanction_loan == True:
        output = {
            field_names.msg: f"cannot sanction loan to customer {customername}, {email} due to his credit rating",
            field_names.status: False
        }
        return res(json.dumps(output), content_type=utils.CONTENT_TYPE)

    interest_amount = round(loan_amount * (rate / 100) * period, 2)
    emi_months = period * 12  # number of emis
    total_amount_pi = round(loan_amount + interest_amount, 2)
    emi_amount = round(total_amount_pi / emi_months, 2)
    try:
        uid = utils.get_uniq_loanid()
        model = models.LOANS(
            uid=uid,
            bankid=found_bank_object,
            customerid=found_customer_object,
            loan_amount=loan_amount,
            rate=rate,
            period=period,
            interest_amount=interest_amount,
            emi_months=emi_months,
            emi_amount=emi_amount,
            total_amount_pi=total_amount_pi
        )
        model.save()
        utils.add_log(f'loan added for customer {customerid} - {customername} from bank {bankid} - {bank_name}', body)
        success = {
            field_names.msg: f'CREDIT LOAN LEFT LIMIT {credit_loan_left}. This customer already has {total_number_of_loans} running worth {total_loaned_value}. '
                             f'loan for Mr/Mrs {customername}(customer id: {customerid}, email: {email}) from bank {bank_name}({bankid}) has been granted. '
                             f'Your remaining loan limit as per your credit score is {loan_limit:,}. '
                             f'Your unique loan reference is {uid}. you have taken a loan of amount {loan_amount:,} for a period of {period} yrs @rate {rate}% '
                             f'per annum and you have to pay an emi of amount {emi_amount:,} per month for next {emi_months} months. You will be paying P+I={total_amount_pi:,}, '
                             f'total interest paid by you will be {interest_amount:,}. Your auto debit will start next month.',
            field_names.status: utils.success
        }
        status_flag = True
    except Exception as ex:
        utils.add_error('loan error', str(ex))
        failed = {
            field_names.msg: f'loan for {bank_name} could not be added',
            field_names.detail: str(ex),
            field_names.status: utils.failed
        }
        status_flag = False
    output = success if status_flag == True else failed
    return res(json.dumps(output), content_type=utils.CONTENT_TYPE)


@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.post_], request_body=params.set_loan_payment_req_body, manual_parameters=[params.param_signer_ref],
                     operation_description=params.set_loan_payment_desc)
@api_view([params.post_])
@utils.borrower_check_signer_middleware()
def fn_payment(req):
    if req.method == utils.GET:
        return res(utils.NO_OP_ALLOWED)

    body = utils.get_body_from_req(req)
    check_flag, msg = lookup.check_field_existence_in_request_body(body, [field_names.payment, field_names.loan_ref, field_names.emi_number])
    if check_flag == False: return res(msg, content_type=utils.CONTENT_TYPE)

    loan_ref = body[field_names.loan_ref]
    emi_number = body[field_names.emi_number]
    payment = float(body[field_names.payment]) * emi_number

    loan_details_customer = lookup.get_existing_loan_details(loan_ref=loan_ref)
    loan_id = loan_details_customer[field_names.id]
    loan_object = loan_details_customer[field_names.object]

    bankid = loan_object[field_names.bankid_id]
    customerid = loan_object[field_names.customerid_id]
    status_flag = loan_not_found = payment_less_than_emi = interest_zero = False
    if loan_id != -1:
        emi_amount = float(loan_object[field_names.emi_amount])
        emi_months = loan_object[field_names.emi_months] - emi_number
        emi_months_repaid = loan_object[field_names.emi_months_repaid] + emi_number
        repaid_amount = float(loan_object[field_names.repaid_amount]) + payment
        loan_amount = loan_object[field_names.loan_amount]
        interest_amount = float(loan_object[field_names.interest_amount]) - payment
    else:
        msg = {
            field_names.msg: f"loan not found",
            field_names.status: status_flag
        }
        loan_not_found = True
    if payment < (emi_amount * emi_number):
        msg = {
            field_names.msg: f"emi is less than actual payable, kindly pay emi amount as {emi_amount * emi_number}",
            field_names.status: status_flag
        }
        payment_less_than_emi = True
    elif interest_amount < 0:
        msg = {
            field_names.msg: f"no payment required, loan can be closed",
            field_names.status: status_flag
        }
        interest_zero = True

    if loan_not_found or payment_less_than_emi or interest_zero:
        return res(json.dumps(msg), content_type=utils.CONTENT_TYPE)

    try:
        model = models.LOANS.objects.filter(uid=loan_ref)
        model.update(
            emi_months=emi_months,
            emi_months_repaid=emi_months_repaid,
            repaid_amount=repaid_amount,
            interest_amount=interest_amount,
        )
        status_flag = True
        utils.add_log(f'payment (cust: {customerid}) / (bank: {bankid}) / loan: {loan_ref}', body)
        msg = {
            field_names.msg: f'PAYMENT= loan: {loan_ref}({loan_id})'
                             f'loan amount: {loan_amount}, emi amount: {emi_amount}, payment: {payment}, emi months: {emi_months}, emi repaid: {repaid_amount}, emi_months_repaid:{emi_months_repaid}, remaining interest: {interest_amount}',
            field_names.status: status_flag
        }
    except Exception as ex:
        utils.add_error('loan error', str(ex))
        msg = {
            field_names.msg: f'payment for {loan_ref}, customer: {customerid} could not be processed',
            field_names.detail: str(ex),
            field_names.status: utils.failed
        }
    return res(json.dumps(msg), content_type=utils.CONTENT_TYPE)


@require_POST
@csrf_exempt
@swagger_auto_schema(methods=[params.post_], request_body=params.get_loan_balance_req_body, manual_parameters=[params.param_signer_ref],
                     operation_description=params.get_loan_balance_desc)
@api_view([params.post_])
@utils.borrower_check_signer_middleware()
def fn_balance(req):
    if req.method == utils.GET:
        return res(utils.NO_OP_ALLOWED)

    body = utils.get_body_from_req(req)
    check_flag, msg = lookup.check_field_existence_in_request_body(body, [field_names.bank_name, field_names.email, field_names.loan_ref,
                                                                          field_names.emi_number])
    if check_flag == False: return res(msg, content_type=utils.CONTENT_TYPE)

    bank_name = body[field_names.bank_name]
    email = body[field_names.email]
    loan_ref = body[field_names.loan_ref]
    emi_number = body[field_names.emi_number]

    bank = lookup.check_bank_exists(name=bank_name)
    customer = lookup.check_customer_exists(email=email)
    bankid = bank[field_names.id]
    customerid = customer[field_names.id]
    loan_details_customer = lookup.get_existing_loan_details(bankid=bankid, customerid=customerid, loan_ref=loan_ref)
    loan_id = loan_details_customer[field_names.id]
    loan_uid = loan_details_customer[field_names.uid]
    loan_object = loan_details_customer[field_names.object]
    if loan_id != -1:
        emi_amount = loan_object[field_names.emi_amount]
        emi_months = loan_object[field_names.emi_months]
        emi_months_repaid = loan_object[field_names.emi_months_repaid]
        repaid_amount = loan_object[field_names.repaid_amount]
        loan_amount = loan_object[field_names.loan_amount]

    bank_entity_exist_check = lookup.check_customer_or_bank_or_loan(bankid)
    customer_entity_exist_check = lookup.check_customer_or_bank_or_loan(customerid)
    loan_entity_exist_check = lookup.check_customer_or_bank_or_loan(loan_id)
    if bank_entity_exist_check == False or customer_entity_exist_check == False or loan_entity_exist_check == False:
        return res(json.dumps(msg_entity_doesnt_exist), content_type=utils.CONTENT_TYPE)

    customer_name = customer[field_names.name]
    msg = {
        field_names.msg: f'Balances= {bank_name}({bankid}) - customer: {customer_name}, email: {email}, emi: {emi_number}, loan: {loan_uid}({loan_id})'
                         f'loan amount: {loan_amount}, emi amount: {emi_amount}, emi months: {emi_months}, emi repaid: {repaid_amount}, emi_months_repaid:{emi_months_repaid}',
        field_names.loan_details: utils.json_encode(loan_object),
        field_names.status: True
    }
    utils.add_log(f'balance check {customer_name}({customerid}) / {bank_name}({bankid})', body)
    return res(json.dumps(msg), content_type=utils.CONTENT_TYPE)
