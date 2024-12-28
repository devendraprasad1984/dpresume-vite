from processor.process_handler import ProcessHandler


class LoanHandler(ProcessHandler):
    """handles loan related functions"""


    def __init__(self):
        pass


    def handle(self, **kwargs):
        super().handle(self.TYPE_LOAN, **kwargs)
