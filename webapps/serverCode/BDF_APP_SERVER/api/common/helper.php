<?php
$nodatafound = "no data found or some fetch error, contact admin";
function handleAdrotatorPull($data)
{
    global $conn, $nodatafound;
    $rows["error"] = $nodatafound;
    $qur = "select * from adrotator";
    $sql = $conn->query($qur);
    if ($sql) {
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
    }
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}

//function handleEventsPull($data)
//{
//    global $conn, $nodatafound;
//    // $rows["error"] = $nodatafound;
//    // $rows1["error"] = $nodatafound;
//    $qur = "select * from upcoming_event ue where event_date>now() order by event_date asc";
//    $qur1 = "select count(ru.eventid) as eventCount,ru.eventid from eventregistrationdetails ru, upcoming_event ue where ue.event_date>now()
//     and ru.eventid=ue.event_id group by ru.eventid";
//    $sql = $conn->query($qur);
//    $sql1 = $conn->query($qur1);
//
//        $events = $sql->fetch_all(MYSQLI_ASSOC);
//        mysqli_free_result($sql);
//
//        $eventCounts = $sql1->fetch_all(MYSQLI_ASSOC);
//        mysqli_free_result($sql1);
//        $rows['data']['events']=$events;
//        $rows['data']['counts']=$eventCounts;
//
//    if ($conn) mysqli_close($conn);
//    echo(json_encode($rows));
//}


function handleConfigPull($data)
{
    global $conn, $nodatafound;
    $rows["error"] = $nodatafound;
    $qur = "select * from config";
    $sql = $conn->query($qur);
    if ($sql) {
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
    }
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}

function handleCategoryPull($data)
{
    global $conn, $nodatafound;
    $rows["error"] = $nodatafound;
    $qur = "SELECT cat.*, det.detail_description FROM category cat
                inner join categorydetails det ON cat.id=det.id";
    $sql = $conn->query($qur);
    if ($sql) {
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
    }
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}

function handleCategoryDetailsPull($data)
{
    global $conn, $nodatafound;
    $rows["error"] = $nodatafound;
    $where = '';
    if (isset($data['id'])) {
        $id = $data['id'];
        $where = "where catid=$id";
    }
    $qur = "SELECT * FROM categoryDetails " . $where;
    $sql = $conn->query($qur);
    if ($sql) {
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
    }
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}


function handleCategoryLevelPagesPull($data)
{
    global $conn, $nodatafound;
    $rows["error"] = $nodatafound;
    $where = '';
    if (isset($data['id'])) {
        $id = $data['id'];
        $where = "where catL2=$id";
    }
    $qur = "SELECT * FROM categorylevelpages " . $where;
    $sql = $conn->query($qur);
    if ($sql) {
        $rows = $sql->fetch_all(MYSQLI_ASSOC);
        mysqli_free_result($sql);
    }
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}


function handleCategoryLevels($data)
{
    global $conn, $nodatafound;
//    $sql = $conn->query("SELECT a.*, b.detail_description FROM category a INNER JOIN CategoryDetails b ON a.id=b.catid");
//    $categories = $sql->fetch_all(MYSQLI_ASSOC);
    $sql = $conn->query("SELECT a.* FROM category a");
    $categories = $sql->fetch_all(MYSQLI_ASSOC);

    $sql = $conn->query("SELECT * FROM categorydetails");
    $details = $sql->fetch_all(MYSQLI_ASSOC);

    $sql = $conn->query("select * from categorylevel1");
    $catL1 = $sql->fetch_all(MYSQLI_ASSOC);

    $sql = $conn->query("select * from categorylevel2");
    $catL2 = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);

    $rows['data']['categories'] = $categories;
    $rows['data']['details'] = $details;
    $rows['data']['catL1'] = $catL1;
    $rows['data']['catL2'] = $catL2;
    if ($conn) mysqli_close($conn);
    echo(json_encode($rows));
}

function handleSupportQueries($data)
{
    global $conn, $success, $failed;
    $name = $conn->real_escape_string($data['name']);
    $mobile = $conn->real_escape_string($data['mobile']);
    $email = $conn->real_escape_string($data['email']);
    $queries = $conn->real_escape_string($data['query']);
    $query = "insert into supportqueries(name, mobile, email, query) values('$name','$mobile','$email','$queries')";
    $result = $conn->query($query);
    if ($conn) mysqli_close($conn);
//    $response['query']=$query;
//    echo json_encode($response);
    echo $result ? $success : $failed;
}








