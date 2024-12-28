<?php
session_start();
require_once '../backend/init.php';
require_once '../backend/helpers.php';

$where = '';
//global $conn;
//global $success;
//global $failed;
try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_GET['member'])) {
            $redirectURI = APP_ROOT . 'contact.php';
            $member=$_GET['member'];
            $_SESSION['member']=$member;
            header('location: ' . $redirectURI);
//            $org = $conn->real_escape_string($_GET['org']);
//            $where = "where email like '%$org%' and isapproved=0";
//            $qur = "update users set isapproved=1 $where";
//            $conn->query($qur);
//            exit(array('status' => 'success','url'=>$redirectURI));
        }
    }
} catch (Exception $e) {
    $err = array();
    $err['error'] = $e->getTraceAsString();
    exit(json_encode($err));
}

?>