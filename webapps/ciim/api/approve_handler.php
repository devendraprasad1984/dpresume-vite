<?php
require_once '../backend/init.php';

$where = '';
global $conn;
global $success;
global $failed;
try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_GET['org'])) {
            $org = $conn->real_escape_string($_GET['org']);
            $where = "where email like '%$org%' and isapproved=0";
            $qur = "update users set isapproved=1 $where";
            $conn->query($qur);
//            exit(json_encode(array('status' => 'success', 'query' => $qur)));
            exit($success);
        } else if (isset($_GET['id'])) {
            $id = $conn->real_escape_string($_GET['id']);
            $where = "where (guid='$id' or id='$id') and isapproved=0";
            $qur = "update users set isapproved=1 $where";
            $conn->query($qur);
//            exit(json_encode(array('status' => 'success', 'query' => $qur)));
            exit($success);
        } else {
            $where = "where isapproved=0";
            $qur = "update users set isapproved=1 $where";
            $conn->query($qur);
//            exit(json_encode(array('status' => 'success', 'query' => $qur)));
            exit($success);
        }
    }
} catch (Exception $e) {
    $err = array();
    $err['error'] = $e->getTraceAsString();
    exit(json_encode($err));
}

?>