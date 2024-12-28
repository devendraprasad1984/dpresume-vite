<?php

$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$failedToken = json_encode(array('status' => 'access not allowed, token failed'));
$invalidToken = json_encode(array('status' => 'token is invalid'));
$server = $_SERVER['REMOTE_ADDR'];
$httpHost=$_SERVER['HTTP_HOST'];

$pathSeparator=DIRECTORY_SEPARATOR;
define('UPLOAD_PATH',dirname(__DIR__, 1) . $pathSeparator."uploads");
define('SECRET_ACCESS_KEY', 'saNSkArRr-aPp_Gl0oBaAlLyY_2@2!2o2!');
define('SECRET_ACCESS_ALGO',array('HS256'));
if ($server == '::1' or $server == 'localhost' or strpos($server,'.168')!=0 or $server == '127.0.0.1') {
    define('host', 'localhost');
    define('user', 'root');
    define('pwd', 'dpadmin');
    define('db', 'sanskar_med_easy');
    define('UPLOAD_URL',"http://$httpHost/sanskar/backend/uploads/");
} else {
//    define('host', 'localhost:3306');
//    define('user', 'wp_p9ii9');
//    define('pwd', 'rbs1984#');
//    define('db', 'wp_8oy2w');
    define('host', 'mysql80-afe9.euw2.cloud.ametnes.com:3316');
    define('user', 'jpLpbGNpNc');
    define('pwd', '7jHvAR82kMWyIczDsg7s');
    define('db', '3863423041');
    define('UPLOAD_URL',"http://$httpHost/sanskar/backend/uploads/");
}
$conn = new mysqli(host, user, pwd, db);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
