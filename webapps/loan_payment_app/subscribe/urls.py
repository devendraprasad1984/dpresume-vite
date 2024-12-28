from
from django.urls import path

import views


urlpatterns = [
    path('newtoken', views.fn_get_new_token),
    path('apisigner', views.fn_check_api_signer),
    path('subscribe', views.fn_subscribe),
    path('subscription_list', views.fn_get_subscribers),
    # path('addapiuser', views.fn_ADD_API_USER),
    path('getjwt', views.fn_jwt_token_pair),
]
