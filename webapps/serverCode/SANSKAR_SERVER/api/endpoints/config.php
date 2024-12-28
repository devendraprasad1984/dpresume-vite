<?php
require_once '../include.php';
try{
    pullTable('config');
}catch (Exception $ex){
    echo json_encode($ex);
}

