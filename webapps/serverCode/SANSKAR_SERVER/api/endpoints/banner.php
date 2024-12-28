<?php
require_once '../include.php';
try{
    pullTable('adrotator',"where placeOnApp='banner'");
}catch (Exception $ex){
    echo json_encode($ex);
}

