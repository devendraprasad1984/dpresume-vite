<?php
//global object arrays
$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$recordExists = json_encode(array('status' => 'success', 'msg' => 'Record already exists and Updated'));

$server = $_SERVER['REMOTE_ADDR'];
$server = 'remote';
if ($server == '::1' or $server == 'localhost' or $server == '127.0.0.1') {
  define('HOST', 'localhost:3306');
  define('USER', 'root');
  define('PWD', null);
  define('DB', 'rwasec8');
} else {
  define('HOST', '103.228.112.82:3306');
  define('USER', 'cuhvjuka');
  define('PWD', 'Geeks1984#');
  define('DB', 'cuhvjuka_dpreact');
}

$conn = new mysqli(HOST, USER, PWD, DB);
