<?php
//if(!isset($_SESSION))
//    die('sessions issue on server, check with admin');

//spl_autoload_register(function($className){
//    require_once 'libraries/' . $className . '.php';
//});
define('APP_ROOT','http://localhost/web/posts-sample/');

$loggedIn = false;
$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));

if ((isset($_POST['loggedIn']) && $_POST['loggedIn'] == 1)) {
    $loggedIn = true;
}

$server = $_SERVER['REMOTE_ADDR'];
//    echo $server;
if ($server == '::1' or $server == 'localhost' or $server == '127.0.0.1') {
    define('host', 'localhost:3306');
    define('user', 'root');
    define('pwd', '');
    define('db', 'ibdn');
} else {
    define('host', 'localhost:3306');
    define('user', 'wp_p9ii9');
    define('pwd', 'rbs1984#');
    define('db', 'wp_8oy2w');
}

$conn = new mysqli(host, user, pwd, db);
if (isset($_SESSION['timeit']) && time() - $_SESSION['timeit'] > 1500) {
    if($conn){
        $conn->close();
    }
    header("Location: logout.php");
}



