<?php
require_once '../include.php';
try{
    $id=$_GET['id'];
    pullTable('orderimages',"where orderid=$id","","id,uri");
}catch (Exception $ex){
    echo json_encode($ex);
}

