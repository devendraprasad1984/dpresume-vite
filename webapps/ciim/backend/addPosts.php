<?php
session_start();
require_once 'init.php';
require_once 'helpers.php';

$loggedIn=checkIfLoggedIn();

if($loggedIn) {
    global $conn;
    $commentId = isset($_POST['comment_id']) ? $_POST['comment_id'] : "";
    $comment = isset($_POST['comment']) ? $_POST['comment'] : "";
    $userid = isset($_POST['userid']) ? $_POST['userid'] : "";
    $date = date('Y-m-d H:i:s');

    if ($commentId == "" || $comment == "" || $userid == "") {
        echo('cannot insert, invalid dataset');
    } else {
        $sql = "INSERT INTO xposts(parent_comment_id,comment,userid,date) VALUES ('" . $commentId . "','" . $comment . "','" . $userid . "','" . $date . "')";
        $result = $conn->query($sql);
        if (!$result) {
            $result = mysqli_error($conn);
        }
        mysqli_close($conn);
        echo 'success';
    }
}
?>
