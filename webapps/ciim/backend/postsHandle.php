<?php
require './backend/init.php';
require './backend/helpers.php';

$loggedIn = false;
if ( isset($_POST['loggedIn']) && $_POST['loggedIn']==1 ){
    $loggedIn = true;
}
global $conn;

try{
if (isset($_POST['getPostsAndReplies'])) {
    $start = $conn->real_escape_string($_POST['start']);
    exit(pullAllposts($start, false, false)); //this function caused issue on server as memory out of stack
} else if (isset($_POST['addComment'])) {
    if (!$loggedIn) exit('notLoggedIn');
    $userid=$conn->real_escape_string($_POST['userid']); // $_SESSION['userId']
    $commentId = $conn->real_escape_string($_POST['commentId']);
    $comment = $conn->real_escape_string($_POST['comment']);
    $isReply = filter_var($conn->real_escape_string($_POST['isReply']), FILTER_VALIDATE_BOOLEAN);
    if ($isReply == true || $isReply == 1) {
        $conn->query("insert into replies(userid,comment,commentid,createdOn) values('" . $userid . "','$comment','$commentId',now())");
        exit(pullReplies(0, true));
    } else {
        $conn->query("insert into posts(userid,comment,createdOn) values('" . $userid . "','$comment',now())");
        exit(pullPosts(0, true));
    }
}else if (isset($_POST['register'])) {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $sql = $conn->query("select id from users where email='$email'");
        if ($sql->num_rows > 0) {
            exit('failedUserExists');
        } else {
            $ePassword = password_hash($password, PASSWORD_BCRYPT);
            $conn->query("insert into users (name,email,password,createdOn) values('$name','$email','$ePassword',now())");
            $sql = $conn->query("select id from users order by id desc limit 1");
            $data = $sql->fetch_assoc();
            exit('success');
        }
    } else {
        exit('failedEmail');
    }
}else if (isset($_POST['login'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $sql = $conn->query("select id,password,name,role from users where email='$email'");
        if ($sql->num_rows == 0) {
            exit('failed');
        } else {
            $data = $sql->fetch_assoc();
            $password_hash = $data['password'];
            if (password_verify($password, $password_hash)) {
                $rows=array();
                $rows['timeit'] = time();
                $rows['loggedIn'] = 1;
                $rows['userid'] = $data['id'];
                $rows['name'] = $data['name'];
                $rows['email'] = $email;
                $rows['role'] = $data['role'];
                exit(json_encode($rows));
            } else {
                exit('failed');
            }
        }
    } else {
        exit('failed');
    }
}
} catch (Exception $ex) {
    die($ex->getTraceAsString());
}






