<?php

$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$failedToken = json_encode(array('status' => 'access not allowed, token failed'));
$invalidToken = json_encode(array('status' => 'token is invalid'));
$server = $_SERVER['REMOTE_ADDR'];
$httpHost=$_SERVER['HTTP_HOST'];

$pathSeparator=DIRECTORY_SEPARATOR;
function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);
    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

define('UPLOAD_PATH',dirname(__DIR__, 1) . $pathSeparator."uploads");
define('SECRET_ACCESS_KEY', 'BdF-aPp_nAtwEsTiFy_2@2!');
define('SECRET_ACCESS_ALGO',array('HS256'));
define('UPLOAD_URL',"http://$httpHost/BDF_APP_SERVER/uploads/");
if ($server == '::1' or $server == 'localhost' or $server == '192.168.1.3' or $server == '127.0.0.1') {
    define('host', 'localhost');
    define('db', 'bdfapp');
    define('user', 'root');
    define('pwd', 'dpadmin');
} else {
    define('host', 'localhost:3306');
    define('user', 'wp_p9ii9');
    define('pwd', 'rbs1984#');
    define('db', 'wp_8oy2w');
}
$conn = new mysqli(host, user, pwd, db);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
