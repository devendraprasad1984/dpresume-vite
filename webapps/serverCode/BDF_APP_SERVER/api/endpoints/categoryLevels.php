<?php
require_once '../include.php';

global $failed;
try {
    handleCategoryLevels($_GET);
} catch (Exception $ex) {
    echo $failed;
}


