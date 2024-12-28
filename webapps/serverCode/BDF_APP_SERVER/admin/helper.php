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
    }
    if (isset($data['update'])) {
        $id = $conn->real_escape_string($data['id']);
        $desc = $conn->real_escape_string($data['desc']);
        $about = $conn->real_escape_string($data['about']);
        $sql = "update adrotator set about='$about', description='$desc' where id=$id";
    }
    if (isset($data['delete'])) {
        $id = $conn->real_escape_string($data['id']);
        $sql = "delete from adrotator where id=$id";
    }
//    ChromePhp::log($data,$sql);
    $result = $conn->query($sql);
    mysqli_close($conn);
    echo $result ? $success : $failed;
}

//function crudEvents($data)
//{
//    global $success, $conn, $failed;
//    $sql = '';
//    if ($data['save'] == "1") {
//        $title = $conn->real_escape_string($data['title']);
//        $desc = $conn->real_escape_string($data['desc']);
//        $date = $conn->real_escape_string($data['date']);
//        $sql = "INSERT INTO upcoming_event(event_date, title, description) values('$date','$title','$desc')";
//    }
//    if ($data['update'] == "1") {
//        $id = $conn->real_escape_string($data['id']);
//        $title = $conn->real_escape_string($data['title']);
//        $desc = $conn->real_escape_string($data['desc']);
//        $date = $conn->real_escape_string($data['date']);
//        $sql = "update upcoming_event set title='$title', description='$desc', event_date='$date' where event_id=$id";
//    }
//    if ($data['delete'] == "1") {
//        $id = $conn->real_escape_string($data['id']);
//        $sql = "delete from upcoming_event where event_id=$id";
//    }
//    $result = $conn->query($sql);
//    mysqli_close($conn);
////    ChromePhp::log($sql, $result);
//    echo $result ? $success : $failed;
//}

function getMaxCatId($tableName)
{
    global $conn;
    $qur = "select max(id) as id from $tableName";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return $rows;
}

function crudCategory($data)
{
    global $success, $conn, $failed;
    $sql = '';
    if (isset($data['save'])) {
        if ($data['savetype'] == "cat") {
            $category = $conn->real_escape_string($data['category']);
            $description = $conn->real_escape_string($data['description']);
            $icons = $conn->real_escape_string($data['icons']);
            $bg = $conn->real_escape_string($data['backgroundColor']);
            $font = $conn->real_escape_string($data['fontColor']);
            $sql = "insert into category(category, description, icons,backgroundColor,fontColor) values('$category','$description','$icons','$bg','$font')";
            $result = $conn->query($sql);
            $maxid = (int)getMaxCatId('category')[0]['id'];
            $sql = "insert into categorydetails(catid, detail_description) values($maxid,'')";
            $result = $conn->query($sql);
        }
        if ($data['savetype'] == "catl1") {
            $catid = $conn->real_escape_string($data['catid']);
            $description = $conn->real_escape_string($data['description']);
            $sql = "insert into categorylevel1(catid, description) values('$catid','$description')";
            $result = $conn->query($sql);
        }
        if ($data['savetype'] == "catl2") {
            $catl1 = $conn->real_escape_string($data['catL1']);
            $description = $conn->real_escape_string($data['description']);
            $sql = "insert into categorylevel2(catl1, description) values('$catl1','$description')";
            $result = $conn->query($sql);
        }
        if ($data['savetype'] == "catpages") {
            $catl2 = $conn->real_escape_string($data['catL2']);
            $description = $conn->real_escape_string($data['description']);
            $subhead = $conn->real_escape_string($data['subhead']);
            $type = $conn->real_escape_string($data['type']);
            $sql = "insert into categorylevelpages( catL2, subhead, description, type) values('$catl2','$subhead','$description','$type')";
            $result = $conn->query($sql);
        }
    }
    if (isset($data['update'])) {
        if ($data['savetype'] == "cat") {
            $id = $conn->real_escape_string($data['id']);
            $category = $conn->real_escape_string($data['category']);
            $description = $conn->real_escape_string($data['description']);
            $icons = $conn->real_escape_string($data['icons']);
            $bg = $conn->real_escape_string($data['backgroundColor']);
            $font = $conn->real_escape_string($data['fontColor']);
            $sql = "update category set category='$category', description='$description', icons='$icons', backgroundColor='$bg', fontColor='$font' where id=$id";
        }
        if ($data['savetype'] == "catdet") {
            $id = $conn->real_escape_string($data['id']);
            $description = $conn->real_escape_string($data['detail_description']);
            $sql = "update categorydetails set detail_description='$description' where id=$id";
        }
        if ($data['savetype'] == "catl1") {
            $id = $conn->real_escape_string($data['id']);
            $description = $conn->real_escape_string($data['description']);
            $sql = "update categorylevel1 set description='$description' where id=$id";
        }
        if ($data['savetype'] == "catl2") {
            $id = $conn->real_escape_string($data['id']);
            $description = $conn->real_escape_string($data['description']);
            $sql = "update categorylevel2 set description='$description' where id=$id";
        }
        if ($data['savetype'] == "catpages") {
            $id = $conn->real_escape_string($data['id']);
            $description = $conn->real_escape_string($data['description']);
            $subhead = $conn->real_escape_string($data['subhead']);
            $type = strtolower($conn->real_escape_string($data['type']));
            $sql = "update categorylevelpages set subhead='$subhead',description='$description',type='$type' where id=$id";
        }
//        ChromePhp::log($sql);
        $result = $conn->query($sql);
    }
    if (isset($data['delete'])) {
        //since constraints arent there in this mysql version and server may have also the same restrictions, deletions would go in reverse parent->child order
        $id = $conn->real_escape_string($data['curdelid']);
        $type = $conn->real_escape_string($data['savetype']);
        $result = false;

        $sqlPages = "delete from categorylevelpages where catL2 in (select a.id from categorylevel2 a inner join categorylevel1 b ON a.catL1 = b.id where b.id = $id)";
        $sqlCatL2 = "delete from categorylevel2 where catL1 in (select a.id from categorylevel1 a where a.id = $id)";
        $sqlCatL1 = "delete from categorylevel1 where id=$id";
        $sqlCatDet = "delete from categorydetails where id=$id";
        $sqlCat = "delete from category where id=$id";
        if ($type == "cat") {
            $conn->query($sqlPages);
            $conn->query($sqlCatL2);
            $conn->query($sqlCatL1);
            $conn->query($sqlCatDet);
            $conn->query($sqlCat);
            $result = true;
        }
        if ($type == "catl1") {
            $conn->query($sqlPages);
            $conn->query($sqlCatL2);
            $conn->query($sqlCatL1);
            $result = true;
        }
        if ($type == "catl2") {
            $sqlPages = "delete from categorylevelpages where catL2 in (select id from categorylevel2 id = $id)";
            $sqlCatL2 = "delete from categorylevel2 where id= $id";
            $conn->query($sqlPages);
            $conn->query($sqlCatL2);
//            ChromePhp::log($sqlPages, $sqlCatL2);
            $result = true;
        }
        if ($type == "catpages") {
            $sqlPages = "delete from categorylevelpages where id = $id";
//            ChromePhp::log($sqlPages);
            $conn->query($sqlPages);
            $result = true;
        }
    }
    mysqli_close($conn);
    echo $result ? $success : $failed;
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
    ChromePhp::log($data, $objMail, $rows);
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
    try {
        $qur = "select $fld from $table $where $orderBy";
        $sql = $conn->query($qur);
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
        mysqli_close($conn);
        if ($rows == false) $rows = ['data' => 'no data found or some error'];
        exit(json_encode($rows));
    } catch (Exception $ex) {
        echo json_encode(["error" => $ex->getMessage() + ', ' + $ex->getTraceAsString()]);
    }
}

//function pullTable($table, $where = '', $orderBy = '', $fld = '*')
//{
//    global $conn;
//    try {
//        $qur = "select $fld from $table $where $orderBy";
//        $sql = mysqli_query($conn, $qur);
//        if (!$sql) {
//            echo mysqli_error();
//            die;
//        }
//        $rows = array();
//        while ($row = mysqli_fetch_assoc($sql)) {
//            $rows[] = $row;
//        }
//        mysqli_free_result($sql);
//        mysqli_close($conn);
////        echo print_r($rows);
//        echo print_r(json_encode($rows));
//    } catch (Exception $ex) {
//        echo json_encode(["error" => $ex->getMessage() + ', ' + $ex->getTraceAsString()]);
//    }
//}

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


function pullCategory($data)
{
    global $conn;
    $what2pull = $data['what2pull'];
    if ($what2pull == '') {
        $sql = $conn->query("SELECT * FROM category");
        $categories = $sql->fetch_all(MYSQLI_ASSOC);

        $sql = $conn->query("SELECT * FROM categorydetails");
        $categories_details = $sql->fetch_all(MYSQLI_ASSOC);

        $sql = $conn->query("select * from categorylevel1");
        $catL1 = $sql->fetch_all(MYSQLI_ASSOC);

        $sql = $conn->query("select * from categorylevel2");
        $catL2 = $sql->fetch_all(MYSQLI_ASSOC);

        $sql = $conn->query("select * from categorylevelpages");
        $pages = $sql->fetch_all(MYSQLI_ASSOC);
        $rows['categories'] = $categories;
        $rows['details'] = $categories_details;
        $rows['catL1'] = $catL1;
        $rows['catL2'] = $catL2;
        $rows['pages'] = $pages;
    }
    if ($what2pull == 'catl1') {
        $sql = $conn->query("select * from categorylevel1");
        $res = $sql->fetch_all(MYSQLI_ASSOC);
        $rows['catL1'] = $res;
    }
    if ($what2pull == 'catl2') {
        $sql = $conn->query("select * from categorylevel2");
        $res = $sql->fetch_all(MYSQLI_ASSOC);
        $rows['catL2'] = $res;
    }
    if ($what2pull == 'catpages') {
        $sql = $conn->query("select * from categorylevelpages");
        $res = $sql->fetch_all(MYSQLI_ASSOC);
        $rows['pages'] = $res;
    }
    mysqli_free_result($sql);
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}

//
//function pullEvents($data)
//{
//    global $conn;
//    $qur = "select event_id,DATE_FORMAT(event_date,'%Y-%m-%dT%h:%i') as event_date,title,description from upcoming_event where event_date>now()";
//    $sql = $conn->query($qur);
//    $rows = $sql->fetch_all(MYSQLI_ASSOC);
//    mysqli_free_result($sql);
//    mysqli_close($conn);
//    echo(json_encode($rows));
//}

//
//function pullRegisteredEventsInfo($data)
//{
//    global $conn;
//    $id = $data['id'];
//    $qur = "select * from eventregistrationdetails where eventid=$id order by id desc";
////    ChromePhp::log($id,$qur);
//    $sql = $conn->query($qur);
//    $rows = $sql->fetch_all(MYSQLI_ASSOC);
//    mysqli_free_result($sql);
//    mysqli_close($conn);
//    echo(json_encode($rows));
//}

function pullCounter($data)
{
    global $conn;
    $qur = "select 'banners' as type,count(*) as counter from adrotator
            union all
            select 'categories', count(*) from category
            union all
            select 'pages', count(*) from categorylevelpages
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



