<?php
require_once '../backend/init.php';
require_once '../backend/helpers.php';

$where = '';
global $conn;
global $success;
global $failed;
try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_GET['id'])) {
            $id = $conn->real_escape_string($_GET['id']);
            $where = "where id=$id";
        }
        $sql = $conn->query("select id,name,email,createdon from users $where order by id desc");
        $data = $sql->fetch_all(MYSQLI_ASSOC);
        exit(json_encode($data));
    } else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['id']) == false) {
        if (isset($_POST['name']) && isset($_POST['email'])) {
            $name = $conn->real_escape_string($_POST['name']);
            $email = $conn->real_escape_string($_POST['email']);
            $guid=returnGuid($email);
            $pwd = password_hash('password123', PASSWORD_BCRYPT);
            $sql = $conn->query("insert into users(name,email,password,createdon,role,isapproved,guid) values('$name','$email','$pwd',now(),'admin',1,'$guid')");
            exit($success);
        } else {
            exit($failed);
        }
    } else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $data =utf8_decode(urldecode(file_get_contents('php://input'))); //x-www-form-urlencoded
//        echo $data;
        if (!isset($_GET['id']))
            exit($failed);
        $userid = $conn->real_escape_string($_GET['id']);
        if (strpos($data, '=') != false) {
            //name=dev&email=abc@gmail.com
            $allPairs = array();
            $data = explode('&', $data);
            foreach ($data as $pair) {
                $tmp = explode('=', $pair);
                $allPairs[$tmp[0]] = $tmp[1];
            }
//            var_dump($allPairs['name']);
            if (isset($allPairs['name']) && isset($allPairs['email'])) {
                $conn->query("update users set name='" . $allPairs['name'] . "', email='" . $allPairs['email'] . "' where id='$userid'");
                exit($success);
            } else if (isset($allPairs['name'])) {
                $conn->query("update users set name='" . $allPairs['name'] . " where id='$userid'");
                exit($success);
            } else if (isset($allPairs['email'])) {
                $conn->query("update users set name='" . $allPairs['email'] . " where id='$userid'");
                exit($success);
            } else {
                exit($failed);
            }
        } else {
            exit($failed);
        }
    } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        if (isset($_GET['id'])) {
            $id = $conn->real_escape_string($_GET['id']);
            $where = "where id=$id and role<>'admin'";
            $sql = $conn->query("delete from users $where");
            exit($success);
        } else {
            exit($failed);
        }
    }
} catch (Exception $e) {
    $err = array();
    $err['error'] = $e->getTraceAsString();
    exit(json_encode($err));
}

?>