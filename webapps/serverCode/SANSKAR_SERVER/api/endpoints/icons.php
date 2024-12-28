<?php
require_once '../include.php';
try{
    $type=$_GET['type'];
    pullTable('icons',"where type=$type");
}catch (Exception $ex){
    echo json_encode($ex);
}

