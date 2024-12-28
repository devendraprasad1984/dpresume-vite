import secrets
from datetime import datetime

from utils import enums


class Utils(enums.Enums):
    """utility functions object"""
    token_length = None


    def __init__(self, token_length=16):
        self.token_length = token_length


    def get_secret_key(self):
        return secrets.token_urlsafe(self.token_length)


    def get_timestamp(self):
        return datetime.now().strftime(self.TIMESTAMP_LOG_FORMAT)


    def print_log(self, **args):
        print_time = self.get_timestamp()
        if self.PRINT_LOG_WITH_TIMESTAMP:
            print(f'log {print_time}: {args.__str__()}')
        else:
            print(f'{args.__str__()}')


    def print_object_wrapper(self, param1=None, param2=None):
        return {'msg': param1, 'param': param2}


    def read_input_file_contents(self, filename):
        f = open(filename, "r")
        file_contents = f.read().splitlines()
        f.close()
        return file_contents


    def print_all_serialize(self, listOfObjects: []):
        """print objects via their serialize call"""
        if listOfObjects.__len__() == 0: return
        for obj in listOfObjects:
            msg = {"message": obj.__str__(), "data": obj.serialize()}
            self.print_log(**msg)


    def print_lists(self, listOfObjects: []):
        """print list values"""
        if listOfObjects.__len__() == 0: return
        for obj in listOfObjects:
            print(obj.__str__())
