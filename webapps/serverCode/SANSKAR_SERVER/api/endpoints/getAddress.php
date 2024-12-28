<?php
require_once '../include.php';
try{
    $id=$_GET['id'];
    pullTable('addresses',"where agentid=$id");
}catch (Exception $ex){
    echo json_encode($ex);
}

