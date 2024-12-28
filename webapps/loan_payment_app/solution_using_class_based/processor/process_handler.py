# from abc import ABC, abstractmethod
from models.loan import Loan
from utils.enums import Enums


class ProcessHandler(Enums):
    """common data handling logic"""
    _this_loan_object_list = None
    _this_command = None
    _this_loan_id = None
    _this_command_type = None
    _bank_name = None
    _customer_name = None
    _bank_id = None
    _customer_id = None


    def handle(self, type=None, **kwargs):
        """handle derived classes handler logic"""
        self._this_command_type = type
        self._this_loan_object_list = kwargs[self.key_loan_object]
        self._this_balance_output = kwargs[self.key_balance_output]
        self._this_command = kwargs[self.key_command]
        self._this_loan_id = kwargs[self.key_loan]
        self._bank_id = kwargs[self.key_bank_id]
        self._customer_id = kwargs[self.key_customer_id]
        self._bank_name = self._this_command[1]
        self._customer_name = self._this_command[2]

        self._process_loan()
        self._process_payment()
        self._process_balance()


    def _process_loan(self):
        """processing loan query"""
        if self._this_command_type != self.TYPE_LOAN: return
        _loan_amount = self._this_command[3]
        _no_of_years = self._this_command[4]
        _rate = self._this_command[5]

        _this_loan = Loan(
            id=self._this_loan_id,
            loan_amount=_loan_amount,
            rate=_rate,
            period=_no_of_years,
        )

        self._this_loan_object_list.append(_this_loan)
        return _this_loan


    def _process_balance(self):
        """processing balance query"""
        if self._this_command_type != self.TYPE_BALANCE: return
        emi_number = int(self._this_command[3])
        cur = self._get_loan_object().serialize()
        amount_paid = int(cur[self.repaid_amount] + cur[self.emi_amount] * emi_number)
        emi_left = int(cur[self.emi_months]) - emi_number
        output = f'{self._bank_name} {self._customer_name} {amount_paid} {emi_left}'
        self._this_balance_output.append(output)


    def _process_payment(self):
        """processing payment query"""
        if self._this_command_type != self.TYPE_PAYMENT: return
        lump_sum_amount = self._this_command[3]
        emi_number = self._this_command[4]
        cur = self._get_loan_object()
        cur.update(lump_sum_payment=lump_sum_amount, emi_months=emi_number)
        # print(self._this_command_type, cur.serialize())


    def processed_loan_object(self):
        """return final modified processed loan object having updated values for loan, balance and payment queries"""
        return self._this_loan_object_list


    def processed_output_balancing(self):
        """return balances output"""
        return self._this_balance_output


    def _get_loan_object(self):
        """return loan object from the stored list of loan objects"""
        found_loan_object = None
        for _ in self._this_loan_object_list:
            if _.get_loan_id() == self._this_loan_id:
                found_loan_object = _
                break
        return found_loan_object
