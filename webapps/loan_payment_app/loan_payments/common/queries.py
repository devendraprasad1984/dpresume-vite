from
from django.db import connection

import field_names
import utils


def get_customer_with_loan_query(**param):
    id = param[field_names.id] if field_names.id in param else ''
    loan_ref = param[field_names.loan_ref] if field_names.loan_ref in param else ''

    check_id = id != '' and id != None
    check_loan_ref = loan_ref != '' and loan_ref != None
    qur = f'select a.id as customerid,b.bankid_id as bankid, a.email,a.name,a.loan_limit,a.uid as cust_uid,b.uid as loan_uid, b.rate,b.period,b.loan_amount '
    qur += f',b.interest_amount,b.emi_months,b.emi_months_repaid,b.repaid_amount,b.emi_amount,b.total_amount_pi,b.when'
    qur += f' from customer_manager_customers a left outer join loan_manager_loans b ON '
    qur += f' a.id=b.customerid_id'
    qur += (f' where a.id={id} and b.bankid_id is not null' if check_id else '')
    qur += (f" where b.uid='{loan_ref}'" if check_loan_ref else '')
    qur += f' order by a.id'

    return qur

def custom_query_run(qur):
    cursor = connection.cursor()
    getfield = lambda i: cursor.description[i][0]
    cursor.execute(qur)
    rows = cursor.fetchall()
    jsondata = [dict((getfield(i), value) for i, value in enumerate(row)) for row in rows]
    cursor = None
    # cursor.connection.close()
    return {"rows": rows, "json": utils.json_encode(jsondata)}
