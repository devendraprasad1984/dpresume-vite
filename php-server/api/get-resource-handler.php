<?php
require_once '../common/index.php';

if (isset($_GET['name']) == false) return PERMISSION_DENIED;
$filename = $_GET['name'];
$filedata = file_get_contents("../resources/$filename.json");
$details = json_decode($filedata);
echo(json1($details));
?>
