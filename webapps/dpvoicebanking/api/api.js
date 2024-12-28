let myHeaders = {"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJkcGN5YmVyciIsIm9yZyI6ImRwY3liZXJyLmNvbSIsImlzcyI6InJicy51c2VpbmZpbml0ZS5pbyIsInRva2VuX3R5cGUiOiJBQ0NFU1NfVE9LRU4iLCJleHRlcm5hbF9jbGllbnRfaWQiOiJYbGxCbUFJbDB3d3VYS1hQMFBFMXZxZ3U5QXgta1JVVzBaVGpMY1hpV1ZNPSIsImNsaWVudF9pZCI6IjM2OWQ2OGMzLWRmZjItNDdmNi1iNjRlLWMzZmJiYTFiYzNiOCIsIm1heF9hZ2UiOjg2NDAwLCJhdWQiOiIzNjlkNjhjMy1kZmYyLTQ3ZjYtYjY0ZS1jM2ZiYmExYmMzYjgiLCJ1c2VyX2lkIjoiMTIzNDU2Nzg5MDEyQGRwY3liZXJyLmNvbSIsImdyYW50X2lkIjoiMGU2MzM4NTgtOWRlZC00NjFkLTk4ZTAtNDEzNDBiOWVkNmI2Iiwic2NvcGUiOiJhY2NvdW50cyBvcGVuaWQiLCJjb25zZW50X3JlZmVyZW5jZSI6IjM2ODMxNWViLTFhNDctNGFlYy05Y2RlLWY0NTc2YjhhYTg3NiIsImV4cCI6MTU5NTEzMDI1NiwiaWF0IjoxNTk1MTI5OTU2LCJqdGkiOiJkZmFhNTNiNi1hNTNlLTQ4NGQtYTRlZS05ZDIwNWM4MmQ5OTMiLCJ0ZW5hbnQiOiJSQlMifQ.lhkKauUB0kDox7L0QFnF_xL2Oi7Bq6qtTsSpnu0CIjyYZCaBjyz64SMbxQenec0NBDk7gqXK1aOOjBXtLbb1AGyq8buWVTE0xlq_5iKo-j63gDy0A4Ihlf6-1cUNsgAaC9ZZC0CieP0aFdjzQ2df2V8JlFyle18ru0lVIM7nalypIoUzOy9vib9pgl7M9S64tZrAwkGOBG6arPce_Kfh0ztWvkMRFvKfQY5VIPo_vr2f3Mw9TX8pxdsb0LpIESCYN-aeNo76xbYyMmwv3BWb171ejf028QOSUYbo_3kwrqH7zJnczCDaPxuFsAsDZS1gxSd15L9jK6JP_fX1a-Hzfw"}

function retrievEndPoint(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://api.rbs.useinfinite.io/.well-known/openid-configuration", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function retrievAccessToken(){
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("client_id", "XllBmAIl0wwuXKXP0PE1vqgu9Ax-kRUW0ZTjLcXiWVM=");
    urlencoded.append("client_secret", "Vpjayh_p_LINsO2W0OggsMbvt2U6Y19TV3dgePIqR7w=");
    urlencoded.append("scope", "accounts");

    var requestOptions = {
        method: 'POST',
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://ob.rbs.useinfinite.io/token", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function postAccountRequestPermissions(){
    let raw = JSON.stringify({"Data":{"Permissions":["ReadAccountsDetail","ReadBalances","ReadTransactionsCredits","ReadTransactionsDebits","ReadTransactionsDetail"]},"Risk":{}});
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/account-access-consents", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function approveAccountConsent(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://api.rbs.useinfinite.io/authorize?client_id=XllBmAIl0wwuXKXP0PE1vqgu9Ax-kRUW0ZTjLcXiWVM=&response_type=code id_token&scope=openid accounts&redirect_uri=http%3A%2F%2Fdpcyberr.com%2Fredirect&state=ABC&request=d04c7d48-e665-4647-aca3-d2a47b19b352&authorization_mode=AUTO_POSTMAN&authorization_username=123456789012@dpcyberr.com", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function exchangeCodeForAccessToken(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "XllBmAIl0wwuXKXP0PE1vqgu9Ax-kRUW0ZTjLcXiWVM=");
    urlencoded.append("client_secret", "Vpjayh_p_LINsO2W0OggsMbvt2U6Y19TV3dgePIqR7w=");
    urlencoded.append("redirect_uri", "http://dpcyberr.com/redirect");
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", "86044d05-cd29-48a9-8fab-790a285d4b00");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://ob.rbs.useinfinite.io/token", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getAccounts(){
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/accounts", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getTransactions(){
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("https://ob.rbs.useinfinite.io/open-banking/v3.1/aisp/accounts/3d781807-fe4e-4832-9b79-5fea330c1d04/transactions?page=0", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
