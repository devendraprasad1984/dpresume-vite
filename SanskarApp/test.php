<?php
$server=$_SERVER['REMOTE_ADDR'];
echo 'server:'.$server;
echo 'Matching: '.preg_match('/192.168./i', $server)
?>
