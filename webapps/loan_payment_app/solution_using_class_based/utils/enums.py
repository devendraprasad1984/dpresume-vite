class Enums():
    """holds the enum/constants to be used across application"""
    key_object = 'object'
    key_id = 'id'
    key_uid = 'uid'
    key_name = 'name'
    key_limit = 'loan_limit'
    key_loan = 'loan_id'
    key_command = 'command'
    key_loan_object = 'loan_object'
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
    DEFAULT_CUSTOMER_LOAN_LIMIT = 10000000
    PRINT_LOG_WITH_TIMESTAMP = False

    loan_id = '_loan_id'
    uid = '_uid'
    customer_id = '_customer_id'
    bank_id = '_bank_id'
    emi_months = '_emi_months'
    emi_months_repaid = '_emi_months_repaid'
    loan_amount = '_loan_amount'
    emi_amount = '_emi_amount'
    rate = '_rate'
    period = '_period'
    interest = '_interest'
    repaid_amount = '_repaid_amount'
    total_amount_pi = '_total_amount_pi'
    loan_amount_left = '_loan_amount_left'
    active = '_active'
    no_of_years = '_no_of_years'
    total_interest = '_total_interest'
    key_balance_output = 'key_balance_output'


    def __str__(self):
        return self.__dict__
