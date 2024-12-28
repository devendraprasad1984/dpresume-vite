<?php

$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$server = $_SERVER['REMOTE_ADDR'];
if ($server == '::1' or $server == 'localhost' or $server == '192.168.1.3' or $server == '127.0.0.1') {
    define('host', 'localhost');
    define('db', 'sanskar_med_easy');
    define('user', 'root');
    define('pwd', 'dpadmin');
} else {
//    define('host', 'mysql80-afe9.euw2.cloud.ametnes.com:3316');
//    define('user', 'jpLpbGNpNc');
//    define('pwd', '7jHvAR82kMWyIczDsg7s');
//    define('db', '3863423041');
    define('host', 'localhost:3306');
    define('user', 'wp_p9ii9');
    define('pwd', 'rbs1984#');
    define('db', 'wp_8oy2w');
}
$conn = new mysqli(host, user, pwd, db);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
