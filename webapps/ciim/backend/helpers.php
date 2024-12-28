<?php

function getAllFromTable($query)
{
    try {
        global $conn;
        $sql = $conn->query($query);
        $rows=array();
        if($sql)
            $rows = $sql->fetch_all(MYSQLI_ASSOC);
        else
            $rows[]='no data found';
        return $rows;
    } catch (Exception $ex) {
        return $ex->getTraceAsString();
    }
}


function getAdminHome()
{
    try {
        global $conn;
        $rows = array();
        $sql = $conn->query('select count(id) as num from users');
        $rows['users'][] = $sql->fetch_assoc()['num'];
        $sql = $conn->query('select count(*) as num from xposts');
        $rows['posts'][] = $sql->fetch_assoc()['num'];
        return json_encode($rows);
    } catch (Exception $ex) {
        return $ex->getTraceAsString();
    }
}

function getSessionData(){
    $_SESSION['started']=1;
    return json_encode($_SESSION);
}


function checkIfLoggedIn(){
    $loggedIn=false;
    if(isset($_SESSION['loggedIn']) && isset($_SESSION['name']) && $_SESSION['loggedIn']==1){
        $loggedIn=true;
    }
    return $loggedIn;
}

function returnGuid($str){
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}


function returnURI(){
    $fullURL = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    return substr($fullURL,0,strlen($fullURL)- strpos(strrev($fullURL),'/'));

}