<?php
require_once 'init.php';

use Firebase\JWT\JWT;

function crudAds($data)
{
    global $success, $conn, $failed;
    $sql = '';
    if (isset($data['save'])) {
        $about = $conn->real_escape_string($data['about']);
        $desc = $conn->real_escape_string($data['desc']);
        $type = $conn->real_escape_string($data['type']);
        $sql = "INSERT INTO adrotator(about, description, type) values('$about','$desc','$type')";
    } elseif (isset($data['update'])) {
        $id = $conn->real_escape_string($data['id']);
        $desc = $conn->real_escape_string($data['desc']);
        $about = $conn->real_escape_string($data['about']);
        $sql = "update adrotator set about='$about', description='$desc' where id=$id";
    } elseif (isset($data['delete'])) {
        $id = $conn->real_escape_string($data['id']);
        $sql = "delete from adrotator where id=$id";
    }
//    ChromePhp::log($data,$sql);
    $result = $conn->query($sql);
    mysqli_close($conn);
    echo $result ? $success : $failed;
}

function getMaxCatId($tableName)
{
    global $conn;
    $qur = "select max(id) as id from $tableName";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return $rows;
}

function crudConfig($data)
{
    global $success, $conn, $failed;
    $sql = '';
    if (isset($data['update'])) {
        $key = $conn->real_escape_string($data['key']);
        $value = $conn->real_escape_string($data['value']);
        $sql = "update config set `value`='$value' where `key`='$key'";
    }
//    ChromePhp::log($data, $sql);
    $result = $conn->query($sql);
    mysqli_close($conn);
    echo $result ? $success : $failed;
}


function crudQuery($data)
{
    global $success, $conn, $failed;
    $id = $conn->real_escape_string($data['id']);
    $query = $conn->real_escape_string($data['queryResponse']);
    $result = false;
    $sql = "insert into supportreplies(supportid, reply, repliedOn) values($id,'$query',now())";
    $conn->query($sql);
    $sql = "update supportqueries set isreplied=1 where id=$id";
    $conn->query($sql);
    $result = true;
    mysqli_close($conn);
    echo $result ? $success : $failed;
}

function crudUpload($data)
{
    global $success, $conn, $failed;
    if (isset($data['delete'])) {
        $id = $conn->real_escape_string($data['id']);
        $uploadData = pullTableRows('fileuploads', "where id=$id", '')[0];
        $result = false;
        $sql = "delete from fileuploads where id=$id";
        $absLoc = $uploadData['absloc'];
        if (unlink($absLoc)) {
            $result = $conn->query($sql);
        }
        mysqli_close($conn);
        echo $result ? $success : $failed;
    }
}

function crudSettings($data)
{
    global $success, $conn, $failed;
    $name = $conn->real_escape_string($data['name']);
    $pwd = $conn->real_escape_string($data['pwd']);
    $email = $conn->real_escape_string($data['email']);
    if ($pwd == '')
        $sql = "update admins set email='$email' where name='$name'";
    else
        $sql = "update admins set password='$pwd',email='$email' where name='$name'";

    $conn->query($sql);
    $result = true;
    mysqli_close($conn);
    echo $result ? $success : $failed;
}

function mailSender($data)
{
    global $success, $failed;
    $objMail = ['emailtype' => 'query'];
    $objMail['query'] = $data['query'];
    $objMail['mailbody'] = $data['mailbody'];
    $objMail['email'] = $data['email'];
//    ChromePhp::log($data, $objMail);
    $result = sendEmail($objMail);
    echo $result ? $success : $failed;
}

function forgotMailSender($data)
{
    global $success, $failed;
    $name = $data['name'];
    $rows = pullTableRows('admins', "where name='$name'")[0];
    $objMail = ['emailtype' => 'forgotMail'];
    $objMail['pwd'] = $rows['password'];
    $objMail['icon'] = $rows['icon'];
    $objMail['email'] = $rows['email'];
    $objMail['name'] = $name;
//    ChromePhp::log($data, $objMail, $rows);
    $result = sendEmail($objMail);
    echo $result ? $success : $failed;
}

function loginHandler($data)
{
    global $failed;
    $pwd = $data['pwd'];
    $name = $data['name'];
    $res = pullTableRows('admins', "where name='$name' and password='$pwd'", "");
    $found = sizeof($res);
    $result = false;
    $successUpdated = [];
    if ($found == 1) {
        $token = generateToken();
        $successUpdated['token'] = $token;
        $successUpdated['status'] = 'success';
        $result = true;
    }
    echo $result ? json_encode($successUpdated) : $failed;
}

function getHost()
{
    $host = $_SERVER['HTTP_HOST'];
    return $host;
}

function getTokenArray()
{
    $token = [
        "host" => getHost()
        , "fakekey" => SECRET_ACCESS_KEY
        , "jumper" => 'nice_bdf_app_natwesters'
    ];
    return $token;
}

function generateToken()
{
    try {
        JWT::$leeway = 60 * 60; // $leeway in seconds
        $jwt = JWT::encode(getTokenArray(), SECRET_ACCESS_KEY);
    } catch (Exception $ex) {
        die("error in generating auth token: " . $ex->getMessage() . ', trace: ' . $ex->getTraceAsString());
    }
    return $jwt;
}

function validateToken($data)
{
    try {
        $jwt = $data['token'];
        $tokenVal = json_encode(getTokenArray());
        $decoded = json_encode(JWT::decode($jwt, SECRET_ACCESS_KEY, SECRET_ACCESS_ALGO));
        $isValid = (json_decode($tokenVal) == json_decode($decoded));
//        ChromePhp::log($jwt,$tokenVal,$decoded,$isValid);
    } catch (Exception $ex) {
        die("the token cannot be validated, may be an attempt to hack");
        $isValid = false;
    }
    return $isValid;
}


function logoutHandler($data)
{
    global $success, $failed;
    $result = true;
    echo $result ? $success : $failed;
}

function pullTable($table, $where = '', $orderBy = '', $fld = '*')
{
    global $conn;
    $qur = "select $fld from $table $where $orderBy";
//    ChromePhp::log($qur);
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    mysqli_close($conn);
//    debug_to_console(array('sql'=>$sql, 'rows'=>$rows));
    echo(json_encode($rows));
}

function pullTableRows($table, $where = '', $orderBy = '')
{
    global $conn;
    $qur = "select * from $table $where $orderBy";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return $rows;
}

function ifExists($tableObject, $where)
{
    global $conn;
    $qur = "select count(*) as num from $tableObject $where";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return $rows;
}

function pullCounter($data)
{
    global $conn;
    $qur = "select 'banners' as type,count(*) as counter from adrotator
            union all
            select 'config', count(*) from config
            union all
            select 'errors', count(*) from error_log
            union all
            select 'queries', count(*) from supportqueries
            union all
            select 'replies', count(*) from supportreplies
            union all
            select 'images', count(*) from fileuploads where type like 'image%'
            union all
            select 'videos', count(*) from fileuploads where type like 'video%'
            ";
    $sql = $conn->query($qur);
//    ChromePhp::log('inside counter',$data,$sql);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);

    mysqli_free_result($sql);
    mysqli_close($conn);
    echo(json_encode($rows));
}


function upload_data($data)
{
    global $success, $conn, $failed;
    $files = $_FILES['file'];
    $file_size = $files['size'];
    $file_type = $files['type'];
    $filename = $files['name'];
    $tmpName = $files["tmp_name"];
    $tags = $data['tags'];
    $pathSeparator = DIRECTORY_SEPARATOR;
    $isImageOrVideo = strpos($file_type, 'image') !== false ? 'images' : 'video';
    $location = UPLOAD_URL . $isImageOrVideo . '/' . $filename;
    $targetFolder = UPLOAD_PATH . $pathSeparator . $isImageOrVideo . $pathSeparator;
    $absPath = $targetFolder . $filename;
    try {
        $response = [];
        $rows = ifExists("fileuploads", "where file='$filename'");
        if ($rows[0]['num'] != "0") {
            $response['status'] = 'tag updated, media already exists';
            $sql = "update fileuploads set tags='$tags' where file='$filename'";
            $result = mysqli_query($conn, $sql);
            mysqli_close($conn);
            echo json_encode($response);
        } else {
            $isMoved = move_uploaded_file($tmpName, $absPath);
            if ($isMoved) {
                $sql = "INSERT into fileuploads(file,size,type,loc,absloc,tags) values ( '$filename','$file_size','$file_type','$location','$absPath','$tags')";
                $result = mysqli_query($conn, $sql);
                mysqli_close($conn);
                echo $result ? $success : $failed;
            } else {
                $response['status'] = 'couldnt upload';
                echo json_encode($response);
            }
        }
    } catch (Exception $e) {
        $response['status'] = 'ran into error' . $e->getMessage();
        echo json_encode($response);
    }
}



