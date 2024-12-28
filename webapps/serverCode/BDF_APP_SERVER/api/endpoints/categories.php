<?php
require_once '../include.php';

global $failed;
try {
    handleCategoryPull($_GET);
} catch (Exception $ex) {
    echo $failed;
}


