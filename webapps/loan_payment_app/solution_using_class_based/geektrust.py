import os
import sys

from app import commands
from utils import utils


sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/..'))


def main():
    args_length = sys.argv.__len__()
    util = utils.Utils()

    if args_length <= 1: return util.print_log('no input supplied')
    input_file_name = sys.argv[1]  # getting input filenames
    input_ledger_commands = util.read_input_file_contents(input_file_name)

    command = commands.Commands(input_ledger_commands)
    final_object = command.process_ledger_commands()
    # util.print_all_serialize(final_object['ledgers'])
    util.print_lists(final_object['output'])


if __name__ == "__main__":
    main()
