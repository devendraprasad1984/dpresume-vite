from
from django.urls import path

import views


urlpatterns = [
    path('addcustomer', views.fn_add_customer),
    path('list', views.fn_get_list_of_customers),
    path('list/<id>', views.fn_get_list_of_customers),
    path('list/loan/ref/<loan_ref>', views.fn_get_customer_loan),
]
