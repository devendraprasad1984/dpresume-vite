<?php
require_once 'include.php';

global $success, $failed, $failedToken, $invalidToken;
try {
    $requestType = strtolower($_SERVER['REQUEST_METHOD']);
    $data = ($requestType == 'get' ? $_GET : $_POST);
    $isTokenPresent = ($requestType == 'get' ? isset($_GET['token']) : isset($_POST['token']));
    if (!$isTokenPresent) die($invalidToken);
    $isLogin=isset($data['login']);
    $isAdmins=isset($data['admins']);
    $isForgot=isset($data['forgot']);
    if(!$isLogin && !$isAdmins && !$isForgot){
        $isTokenValidated = validateToken($data);
        if (!$isTokenValidated) die($failedToken);
    }

    if (isset($data['ads'])) pullTable('adrotator', "where placeOnApp<>'offer'", 'order by id');
    elseif (isset($data['offer'])) pullTable('adrotator', "where placeOnApp='offer'", 'order by id');
    elseif (isset($data['admins'])) pullTable('admins', '', '','name,icon');
    elseif (isset($data['userSetting'])) pullTable('admins', "where name='".$data['name']."'", '','email');
    elseif (isset($data['config'])) pullTable('config');
    elseif (isset($data['errors'])) pullTable('error_log', '', 'order by error_log_date desc limit 30');
    elseif (isset($data['support'])) pullTable('supportqueries', '', 'order by isreplied asc, id desc limit 200');
    elseif (isset($data['counter'])) pullCounter($data);
    elseif (isset($data['replies'])) pullTable('supportreplies', "where supportid=".$data['id'], 'order by repliedon desc limit 200');
    elseif (isset($data['crudAds'])) crudAds($data);
    elseif (isset($data['crudConfig'])) crudConfig($data);
    elseif (isset($data['crudQuery'])) crudQuery($data);
    elseif (isset($data['crudUpload'])) crudUpload($data);
    elseif (isset($data['crudSetting'])) crudSettings($data);
    elseif (isset($data['sendmail'])) mailSender($data);
    elseif (isset($data['login'])) loginHandler($data);
    elseif (isset($data['logout'])) logoutHandler($data);
    elseif (isset($data['forgot'])) forgotMailSender($data);
    elseif (isset($data['getImageData'])) pullTable('fileuploads', "where type LIKE 'image%'", 'order by id desc');
    elseif (isset($data['getVideoData'])) pullTable('fileuploads', "where type LIKE 'video%'", 'order by id desc');
    elseif (isset($data['upload'])) upload_data($data);
} catch (Exception $ex) {
    echo json_encode($ex);
}

?>
