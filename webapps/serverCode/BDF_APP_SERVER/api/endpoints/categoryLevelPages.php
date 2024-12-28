<?php
require_once '../include.php';

global $failed;
try {
    handleCategoryLevelPagesPull($_GET);
} catch (Exception $ex) {
    echo $failed;
}


