from django.db import models

from bank_manager import models as bank
from customer_manager import models as customer


class LOANS(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True)
    uid = models.CharField(max_length=30, null=True, unique=True)
    bankid = models.ForeignKey(bank.BANKS, to_field='id', on_delete=models.CASCADE)
    customerid = models.ForeignKey(customer.CUSTOMERS, to_field='id', on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    period = models.IntegerField(default=0)
    interest_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    emi_months = models.IntegerField(default=0)
    emi_months_repaid = models.IntegerField(default=0)
    repaid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount_pi = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    when = models.DateTimeField(auto_now_add=True, blank=True)
    active = models.BooleanField(default=True)


class QueryLog(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True)
    type = models.CharField(max_length=150)
    log = models.TextField()
    when = models.DateTimeField(auto_now_add=True, blank=True)
