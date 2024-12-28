<?php
require_once 'init.php';

global $conn;
$postid = isset($_POST['postid']) ? $_POST['postid'] : "";
if ($postid == "") {
    echo('cannot process, invalid dataset');
} else {
    $sql = "delete from xposts where comment_id='$postid'";
    $result = $conn->query($sql);
    if (!$result) {
        $result = mysqli_error($conn);
    }
    mysqli_close($conn);
    echo 'success';
}

?>
