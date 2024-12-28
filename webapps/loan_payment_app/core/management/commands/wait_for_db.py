import time

from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """django overriding default app run until database is made available"""

    def handle(self, *args, **options):
        self.stdout.write('waiting for db connection...')
        db_conn = None
        while not db_conn:
            try:
                db_conn = connections['default']
            except OperationalError:
                self.stdout.write(self.style.ERROR('database is not available, re-checking in 1sec'))
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS('database is available'))
