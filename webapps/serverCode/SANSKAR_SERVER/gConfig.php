<?php
$server = $_SERVER['REMOTE_ADDR'];
define('EMAIL_NAME', 'Sanskar MediEasy');
//activate gmail mail sending: https://myaccount.google.com/u/0/lesssecureapps?pli=1
define('SITENAME', 'Sanskar MediEasy');
if ($server == '::1' or $server == 'localhost' or strpos($server, '.168.') != 0 or $server == '127.0.0.1') {
    define('EMAIL_HOST', 'smtp.gmail.com');
    define('EMAIL_USERNAME', 'dpribdn@gmail.com');
    define('EMAIL_PASSWORD', 'ibdn2020#');
}
else{
    define('EMAIL_HOST', 'smtp.gmail.com');
    define('EMAIL_USERNAME', 'dpribdn@gmail.com');
    define('EMAIL_PASSWORD', 'ibdn2020#');
}

//Auto load core libraries
spl_autoload_register(function ($className) {
    if($className=='JWT'){
        require_once 'token/' . $className . '.php';
    }else{
        require_once 'helper/' . $className . '.php';
    }
});
