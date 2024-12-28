<?php
include "../api/app.php";


function returnDataset($qur)
{
    global $conn;
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return json_encode($rows);
}

function handleFeedbackSave($data)
{
    global $success, $conn;
    $title = $conn->real_escape_string($data['title']);
    $feedback = $conn->real_escape_string($data['desc']);
    $ipFromUI = $conn->real_escape_string($data['ip']);
    $ip = $_SERVER['REMOTE_ADDR'];

    $sql = "INSERT INTO dp_feedback(feedback, title,ip) values('$feedback','$title','$ipFromUI')";
    $result = $conn->query($sql);
    echo $success;
}

function handleFeedbackDelete($data)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $sql = "delete from dp_feedback where id='$id'";
    $result = $conn->query($sql);
    echo $success;
}


function getFeedbacksAnonymous(){
    $qur="select * from dp_feedback order by `time` desc";
    $rows = returnDataset($qur);
    echo $rows;
}