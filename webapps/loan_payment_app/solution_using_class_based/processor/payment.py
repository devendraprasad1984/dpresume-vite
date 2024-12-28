from processor.process_handler import ProcessHandler


class PaymentHandler(ProcessHandler):
    """handles payment related functions"""


    def __init__(self):
        pass


    def handle(self, **kwargs):
        super().handle(self.TYPE_PAYMENT, **kwargs)
