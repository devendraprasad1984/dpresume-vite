# from functools import wraps
import sys
from datetime import datetime


"""
    solution to issue loans to customers from banks, display balances and get payment as monthly emis or bulk payment
    this solution will work in memory and wont be saved
    assumptions
    1.input will be in correct format
    2.only 3 types of processing will be allowed, LOAN, PAYMENT and Balances enquiry
"""

key_object = 'object'
key_id = 'id'
key_name = 'name'
key_limit = 'loan_limit'
key_loan = 'loan_id'
key_customer_id = 'customer_id'
key_customer_name = 'customer_name'
key_bank_id = 'bank_id'
key_bank_name = 'bank_name'
key_emi_months = 'emi_months'
key_emi_months_repaid = 'emi_months_repaid'
key_loan_amount = 'loan_amount'
key_emi_amount = 'emi_amount'
key_rate = 'rate'
key_period = 'period'
key_interest = 'interest'
key_repaid_amount = 'repaid_amount'
key_total_amount_pi = 'total_amount_pi'
key_when = 'when'
key_active = 'active'
key_found = 'found'

TYPE_LOAN = 'LOAN'
TYPE_BALANCE = 'BALANCE'
TYPE_PAYMENT = 'PAYMENT'
TIMESTAMP_LOG_FORMAT = "%Y_%m_%d-%I:%M:%S_%p"
BANKS = []
CUSTOMERS = []
LEDGER = []
DEFAULT_CUSTOMER_LOAN_LIMIT = 10000000
PRINT_LOG_WITH_TIMESTAMP = False

def get_timestamp():
    return datetime.now().strftime(TIMESTAMP_LOG_FORMAT)

def print_log(args):
    print_time = get_timestamp()
    if PRINT_LOG_WITH_TIMESTAMP:
        print(f'log {print_time}: {args.__str__()}')
    else:
        print(f'{args.__str__()}')

def print_object_wrapper(param1=None, param2=None):
    return {'msg': param1, 'param': param2}

def read_input_file_contents(filename):
    f = open(filename, "r")
    file_contents = f.read().splitlines()
    f.close()
    return file_contents

def insert_new_loan(new_loan_object):
    new_id = LEDGER.__len__() + 1
    new_object = {key_id: new_id, key_object: new_loan_object}
    LEDGER.insert(new_id - 1, new_object)

def insert_new_bank_customer(object, name):
    find = list(filter(lambda row: row[key_name] == name, object))
    if find.__len__() != 0: return int(find[key_id])
    new_id = object.__len__() + 1
    new_object = {key_id: new_id, key_name: name}
    object.insert(new_id - 1, new_object)
    return new_id

def find_bank_customer_loan_object(object, name=None, id=None, loan_id=None):
    find = []
    if name != None:
        find = list(filter(lambda row: row[key_name] == name, object))
    if id != None:
        find = list(filter(lambda row: row[key_id] == id, object))
    if loan_id != None:
        find = list(filter(lambda row: row[key_object][key_loan] == loan_id, object))

    if find.__len__() != 0: return {key_found: True, key_object: find[0]}
    return {key_found: False}

def get_bank_id(name):
    return insert_new_bank_customer(BANKS, name)

def get_customer_id(name):
    id = insert_new_bank_customer(CUSTOMERS, name)
    obj = find_bank_customer_loan_object(CUSTOMERS, name=name)
    if obj[key_found] == False: return -1
    obj[key_object][key_limit] = DEFAULT_CUSTOMER_LOAN_LIMIT
    return id

def get_loan_detail(customer_name=None, bank_name=None):
    customer_object = find_bank_customer_loan_object(CUSTOMERS, name=customer_name)
    bank_object = find_bank_customer_loan_object(BANKS, name=bank_name)
    customer_id = customer_object[key_object][key_id]
    bank_id = bank_object[key_object][key_id]
    loan_id = f'{bank_id}_{customer_id}'
    customer_loan = find_bank_customer_loan_object(LEDGER, loan_id=loan_id)
    customer_loan_object = customer_loan[key_object][key_object]
    return customer_loan[key_found], customer_loan_object

def handle_loan(command):
    if command.__len__() != 6: return
    bank_name = command[1]
    bank_id = get_bank_id(bank_name)
    customer_name = command[2]
    customer_id = get_customer_id(customer_name)
    amount = float(command[3])
    no_of_years = int(command[4])
    rate_of_interest = float(command[5])
    loan_id = f'{bank_id}_{customer_id}'
    existing_loan_if_any = find_bank_customer_loan_object(LEDGER, id=loan_id)
    if existing_loan_if_any[key_found] == True: return print_log(f'cant create new loan for customer {customer_name}({customer_id} from bank {bank_name}({bank_id})')

    emi_months = no_of_years * 12
    total_interest = round(amount * no_of_years * rate_of_interest / 100)
    total_amount_pi = amount + total_interest
    emi_amount = round(total_amount_pi / emi_months)

    loan_object = {
        key_loan: loan_id,
        key_customer_id: customer_id,
        key_bank_id: bank_id,
        key_emi_months: emi_months,
        key_emi_months_repaid: 0,
        key_loan_amount: amount,
        key_emi_amount: emi_amount,
        key_rate: rate_of_interest,
        key_period: no_of_years,
        key_interest: total_interest,
        key_repaid_amount: 0,
        key_total_amount_pi: total_amount_pi,
        key_when: get_timestamp(),
        key_active: True,
    }
    insert_new_loan(loan_object)
    print_log(f'LOAN sanctioned for {customer_name}({customer_id}) from {bank_name}({bank_id}) for amount {amount} @ {rate_of_interest} '
              f'for {no_of_years} years. emi: {emi_amount} for {emi_months} months. P+I: {total_amount_pi}, I: {total_interest}')

def handle_balance(command):
    if command.__len__() != 4: return
    bank_name = command[1]
    customer_name = command[2]
    emi_number = int(command[3])

    flag, customer_loan = get_loan_detail(customer_name=customer_name, bank_name=bank_name)
    if flag == False: return

    emi_remaining = int(customer_loan[key_emi_months]) - emi_number
    amount_paid = round(float(customer_loan[key_emi_amount]) * emi_number)
    amount_remaining = round(float(customer_loan[key_total_amount_pi]) - amount_paid)

    print_log(f'BALANCE: {customer_name} from {bank_name} amount paid {amount_paid} '
              f'and remaining {amount_remaining}. Total emis paid are {emi_number} and '
              f'remaining are {emi_remaining}')

def handle_payment(command):
    if command.__len__() != 5: return
    bank_name = command[1]
    customer_name = command[2]
    emi_payment = float(command[3])
    emi_number = int(command[4])

    flag, customer_loan = get_loan_detail(customer_name=customer_name, bank_name=bank_name)
    if flag == False:
        return

    emi_amount = int(customer_loan[key_emi_amount])
    if emi_payment < emi_amount:
        print_log(f'emi payment {emi_payment} must be greater than emi amount {emi_amount}')
        return
    emi_months_repaid = int(customer_loan[key_emi_months_repaid]) + emi_number
    emi_months_remaining = int(customer_loan[key_emi_months]) - emi_months_repaid
    amount_repaid = float(customer_loan[key_repaid_amount]) + emi_payment
    total_pi_remaining = float(customer_loan[key_total_amount_pi]) - emi_payment

    loan_update_object = {
        key_emi_months: emi_months_remaining,
        key_emi_months_repaid: emi_months_repaid,
        key_repaid_amount: amount_repaid,
        key_total_amount_pi: total_pi_remaining
    }
    customer_loan.update(loan_update_object)
    print_log(
        f'PAYEMENT of {emi_payment} received from {customer_name}, who borrowed {customer_loan[key_loan_amount]} from {bank_name}.'
        f' His remaining loan details are: repaid: {amount_repaid}, remaining period: {emi_months_remaining}, P+I: {total_pi_remaining}'

    )

def get_command_handler(command):
    if command == TYPE_LOAN: return handle_loan
    if command == TYPE_BALANCE: return handle_balance
    if command == TYPE_PAYMENT: return handle_payment

def print_base_objects():
    print('-' * 80)
    print_log(f'checking BANKS {BANKS}')
    print_log(f'checking CUSTOMERS {CUSTOMERS}')
    print_log(f'checking LOANS {LEDGER}')
    print('-' * 80)

def process_ledger_commands(commands):
    for command in commands:
        if command == '': continue
        command_keys = command.split(' ')
        command_handler = get_command_handler(command_keys[0])
        command_handler(command_keys)

def main():
    args_length = sys.argv.__len__()
    if args_length <= 1: return print_log('no input supplied')
    input_file_name = sys.argv[1]  # getting input filenames
    input_ledger_commands = read_input_file_contents(input_file_name)
    process_ledger_commands(input_ledger_commands)
    print_base_objects()

if __name__ == "__main__":
    main()
