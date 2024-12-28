from factory.command_handler import CommandHandlerFactory
from models import bank, customer
from utils import checkers, enums


class Commands(enums.Enums, checkers.Checker):
    """processing commands logic"""
    handler = None
    _banks = []
    _customers = []
    _loans = []
    _output = []


    def __init__(self, commands=None):
        self.commands = commands


    def _add_bank_if_missing(self, name):
        found, id = self.check_present_of_same_name_object(self._banks, name)
        if id == -1:
            id = self._banks.__len__() + 1
            self._banks.append(bank.Bank(id=id, name=name))
        return id


    def _add_customer_if_missing(self, name):
        # hold customer details
        found, id = self.check_present_of_same_name_object(self._customers, name)
        if id == -1:
            id = self._customers.__len__() + 1
            self._customers.append(customer.Customer(id=id, name=name))
        return id


    def process_ledger_commands(self):
        for cmd in self.commands:
            if cmd == '': continue
            command_keys = cmd.split(' ')
            bank_name = command_keys[1]
            customer_name = command_keys[2]

            bank_id = self._add_bank_if_missing(name=bank_name)
            customer_id = self._add_customer_if_missing(name=customer_name)
            loan_id = f'{bank_id}_{customer_id}'

            """process and handle command LOAN, PAYMENT, BALANCE"""
            command_handler = CommandHandlerFactory(type=command_keys[0]).get()
            params = {
                self.key_command: command_keys,
                self.key_loan: loan_id,
                self.key_bank_id: bank_id,
                self.key_customer_id: customer_id,
                self.key_loan_object: self._loans,
                self.key_balance_output: self._output
            }
            command_handler.handle(**params)
            self._loans = command_handler.processed_loan_object()
            self._output = command_handler.processed_output_balancing()

        return {
            'banks': self._banks,
            'customers': self._customers,
            'ledgers': self._loans,
            'output': self._output,
        }
