<?php
require_once '../include.php';

global $failed;
try {
    handleCategoryDetailsPull($_GET);
} catch (Exception $ex) {
    echo $failed;
}


