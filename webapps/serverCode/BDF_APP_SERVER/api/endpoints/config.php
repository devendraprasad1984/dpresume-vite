<?php
require_once '../include.php';

global $failed;
try{
    handleConfigPull($_GET);
}catch (Exception $ex){
    echo $failed;
}

