<?php
//session_start();
require_once '../backend/init.php';
require_once '../backend/helpers.php';

if (isset($_POST['getPosts'])) {
    $start = $conn->real_escape_string($_POST['start']);
    $latest = filter_var($_POST['latest'], FILTER_VALIDATE_BOOLEAN);
    exit(pullPosts($start, $latest));
} else if (isset($_POST['getReplies'])) {
    $commentId = $conn->real_escape_string($_POST['commentId']);
    $latest = filter_var($_POST['latest'], FILTER_VALIDATE_BOOLEAN);
    exit(pullReplies($commentId, $latest));
}