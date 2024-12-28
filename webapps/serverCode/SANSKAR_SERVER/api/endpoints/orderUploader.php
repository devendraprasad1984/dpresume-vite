<?php
require_once '../include.php';

try {
    $data['files'] = $_FILES['files'];
    $data['id'] = $_POST['id'];
    $data['type'] = $_POST['type'];
    $data['remarks'] = $_POST['remarks'];
    handleOrderSave($data);
} catch (Exception $ex) {
    echo json_encode($ex);
}
