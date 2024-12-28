from processor.process_handler import ProcessHandler


class BalanceHandler(ProcessHandler):
    """handles balance related functions"""


    def __init__(self):
        pass


    def handle(self, **kwargs):
        super().handle(self.TYPE_BALANCE, **kwargs)
