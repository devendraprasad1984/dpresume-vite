from
from django.urls import path

import views


urlpatterns = [
    path('loan', views.fn_loan),
    path('payment', views.fn_payment),
    path('balance', views.fn_balance),
]
