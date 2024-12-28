class Checker():
    """some utils checker functions"""


    def check_present_of_same_name_object(self, object=None, name=None):
        if object == None or name == None: return False, -1

        found = False
        id = -1
        for b in object:
            if b.get_name() == name:
                found = True
                id = b.get_id()
                break
        return found, id
