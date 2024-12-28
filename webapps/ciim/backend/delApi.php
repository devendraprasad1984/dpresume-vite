<?php
session_start();
require_once 'init.php';
require_once 'helpers.php';

$loggedIn=checkIfLoggedIn();

if($loggedIn && $_SESSION['role']=='admin') {
    global $conn;
    $isOk = false;

    if (isset($_POST['deletePost']) && $_POST['deletePost'] == 1) {
        $postid = isset($_POST['postid']) ? $_POST['postid'] : "";
        $sql = "delete from xposts where comment_id='$postid'";
        $isOk = true;
    }

    if (isset($_POST['deleteUser']) && $_POST['deleteUser'] == 1) {
        $userid = isset($_POST['userid']) ? $_POST['userid'] : "";
        $sql = "delete from users where id='$userid'";
        $isOk = true;
    }

    if ($isOk) {
        $result = $conn->query($sql);
        if (!$result) {
            $result = mysqli_error($conn);
        }
        mysqli_close($conn);
        echo 'success';
    }
}

?>
