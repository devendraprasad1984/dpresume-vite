<?php
require_once 'headers.php';

function json($str = '')
{
    return json_encode(array("data" => $str));
}

function json1($str = '')
{
    return json_encode($str);
}

DEFINE('PERMISSION_DENIED', json('permission defined'));
?>
