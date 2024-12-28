<?php
$parentDir = dirname(__DIR__, 1);
$host=$_SERVER['HTTP_HOST'];

$ps = DIRECTORY_SEPARATOR;
$appdir = $parentDir . $ps;
$apidir = $parentDir . $ps . 'api';
$helperdir = $parentDir . $ps . 'helper';
$phpmailer = $parentDir . $ps . 'PHPMailer';
$commondir = $apidir . $ps . 'common';
$uploaddir = $apidir . $ps . 'uploads';
define('UPLOAD_DIR', $uploaddir);
define('HTTP_HOST',"http://$host");
define('UPLOAD_URL',HTTP_HOST."/SANSKAR_SERVER/api/uploads");

require_once $helperdir . $ps . "ChromePHP.php";
require_once $apidir . $ps . "init.php";

require_once $appdir . $ps . "gConfig.php";
require_once $helperdir . $ps . "email_helper.php";
require_once $helperdir . $ps . "error_handler.php";

require_once $commondir . $ps . "header.php";
require_once $commondir . $ps . "helper.php";

require $phpmailer . $ps . "Exception.php";
require $phpmailer . $ps . "PHPMailer.php";
require $phpmailer . $ps . "SMTP.php";
