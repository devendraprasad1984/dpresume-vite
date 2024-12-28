<?php
require_once './ChromePHP.php';
require_once './helper.php';
//require_once("./whatsapp/src/whatsprot.class.php");

global $success, $failed;
try{
    if(isset($_POST['save'])) handleSave($_POST);
    if(isset($_GET['expenses'])) handleExpensesReport($_GET);
    if(isset($_GET['summary1'])) handleSummary1($_GET);
    if(isset($_POST['delete'])) handleDelete($_POST);
    if(isset($_POST['whatsapp'])) sendWhatsApp($_POST);

}catch (Exception $ex){
//    ChromePhp::error($ex->getMessage());
    echo $failed;
}

?>
