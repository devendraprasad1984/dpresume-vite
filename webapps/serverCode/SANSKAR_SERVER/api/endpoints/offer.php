<?php
require_once '../include.php';
try{
    $id=$_GET['agentid'];
    pullTable('offers',"where agentid=$id and active=1");
}catch (Exception $ex){
    echo json_encode($ex);
}

