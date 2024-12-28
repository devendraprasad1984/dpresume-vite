<?php
$parentDir=dirname(__DIR__,1);
$ps=DIRECTORY_SEPARATOR;

$appdir=$parentDir.$ps;
$helperdir=$parentDir.$ps."helper";
$tokendir=$parentDir.$ps."token";
$phpmailer=$parentDir.$ps.'PHPMailer';
$admindir=$parentDir.$ps."admin";

require_once $helperdir.$ps."ChromePHP.php";
require_once $tokendir.$ps."JWT.php";
require_once $admindir.$ps."init.php";

require_once $appdir.$ps."gConfig.php";
require_once $helperdir.$ps."email_helper.php";
require_once $helperdir.$ps."error_handler.php";

require_once $admindir.$ps."helper.php";
require_once $admindir.$ps."header.php";

require $phpmailer.$ps."Exception.php";
require $phpmailer.$ps."PHPMailer.php";
require $phpmailer.$ps."SMTP.php";

