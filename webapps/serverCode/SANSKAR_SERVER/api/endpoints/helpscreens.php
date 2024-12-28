<?php
require_once '../include.php';
try{
    $data=$_GET;
    $screenName=$data['name'];
    pullTable('helpscreens',"where screen='$screenName'");
}catch (Exception $ex){
    echo json_encode($ex);
}

