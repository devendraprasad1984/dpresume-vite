<?php
require_once '../include.php';

global $failed;
try{
    handleAdrotatorPull($_GET);
}catch (Exception $ex){
    echo $failed;
}

