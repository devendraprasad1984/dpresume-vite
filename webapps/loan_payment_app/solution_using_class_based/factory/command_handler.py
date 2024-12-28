from processor import balance as BalanceProcessor, loan as LoanProcessor, payment as PaymentProcessor
from utils.enums import Enums


class CommandHandlerFactory(Enums):
    """return relevant command handler class"""
    command_type = None


    def __init__(self, type=None):
        self.command_type = type


    def get(self):
        handler = None
        if self.command_type == self.TYPE_LOAN: handler = LoanProcessor.LoanHandler()
        if self.command_type == self.TYPE_BALANCE: handler = BalanceProcessor.BalanceHandler()
        if self.command_type == self.TYPE_PAYMENT: handler = PaymentProcessor.PaymentHandler()
        return handler
