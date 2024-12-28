<?php
session_start();
require 'init.php';
require 'helpers.php';

global $conn;
if (isset($_POST['register'])) {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);
    $guid=returnGuid($email);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $sql = $conn->query("select id from users where email='$email'");
        if ($sql->num_rows > 0) {
            exit('failedUserExists');
        } else {
            $ePassword = password_hash($password, PASSWORD_BCRYPT);
            $conn->query("insert into users (name,email,password,guid,createdOn) values('$name','$email','$ePassword','$guid',now())");
            $sql = $conn->query("select id from users order by id desc limit 1");
            $data = $sql->fetch_assoc();
            exit('success');
        }
    } else {
        exit('failedEmail');
    }
} else if (isset($_POST['login'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $sql = $conn->query("select * from users where email='$email' and isapproved=1");
        if ($sql->num_rows == 0) {
            exit('failed or not approved');
        } else {
            $data = $sql->fetch_assoc();
            $password_hash = $data['password'];
            if (password_verify($password, $password_hash)) {
                $rows = array();
                $_SESSION['timeit'] = time();
                $_SESSION['loggedIn'] = 1;
                $_SESSION['userid'] = $data['id'];
                $_SESSION['name'] = $data['name'];
                $_SESSION['email'] = $email;
                $_SESSION['role'] = $data['role'];
                $_SESSION['guid'] = $data['guid'];
                $rows=$_SESSION;
                exit(json_encode($rows));
            } else {
                exit('failed');
            }
        }
    } else {
        exit('failed');
    }
}






