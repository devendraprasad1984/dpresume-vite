<?php

$res = [];

//define('APP_ROOT','http://localhost/web/posts-sample/');

//$loggedIn = false;
$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$recordExists = json_encode(array('status' => 'success', 'msg' => 'Record already exists and Updated'));

$server = $_SERVER['REMOTE_ADDR'];
if ($server == '::1' or $server == 'localhost' or $server == '127.0.0.1') {
    define('HOST', 'localhost:3306');
    define('USER', 'root');
    define('PWD', null);
    define('DB', 'rwasec8');
} else {
    define('HOST', 'localhost:3306');
    define('USER', 'wp_p9ii9');
    define('PWD', 'rbs1984#');
    define('DB', 'wp_8oy2w');
}

$conn = new mysqli(HOST, USER, PWD, DB);

function returnDataset($qur)
{
    global $conn;
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return json_encode($rows);
}

function handleSave($data)
{
    global $success, $conn;
    $memid = $conn->real_escape_string($data['memid']);
    $time = $conn->real_escape_string($data['time']);
    $amount = $conn->real_escape_string($data['amount']);
    $remarks = $conn->real_escape_string($data['remarks']);
    $ip = 'ip & location';

    $sql = "INSERT INTO rwa_expenses(memid,date,amount,remarks,iploc) values('$memid','$time','$amount','$remarks','$ip')";
    $result = $conn->query($sql);
    echo $success;
//    mysqli_close($conn);
}

function handleSaveExpense($data)
{
    global $success, $conn;
    $amount = $conn->real_escape_string($data['amount']);
    $remarks = $conn->real_escape_string($data['reason']);
    $amount = 0 - $amount;
    $adminRow = returnDataset("select id from rwa_members where memkey='admin' and type='admin'");
    $decoded = json_decode($adminRow);
    $adminid = $decoded[0]->id;
    $sql = "INSERT INTO rwa_expenses(memid,amount,remarks) values('$adminid','$amount','$remarks')";
    $result = $conn->query($sql);
    echo $success;
//    mysqli_close($conn);
}


function handleSaveMember($data)
{
    global $success, $conn, $recordExists;
    $memid = $conn->real_escape_string($data['memberid']);
    $name = $conn->real_escape_string($data['name']);
    $address = $conn->real_escape_string($data['address']);
    $type = $conn->real_escape_string($data['type']);
    $address_number_sort = $conn->real_escape_string($data['address_number_sort']);
    $pic = '';

    $result = returnDataset("select count(*) as count from rwa_members where memkey='$memid'");
    $count = json_decode($result)[0]->count;
    if ($count == 1) {
        $sql = "update rwa_members set name='$name',address='$address',type='$type',address_number_sort='$address_number_sort' where memkey='$memid' ";
        $result = $conn->query($sql);
        echo $recordExists;
    } else {
        $sql = "INSERT INTO rwa_members(memkey,name,address,address_number_sort,pic,type) values('$memid','$name','$address','$address_number_sort','$pic','$type')";
        $result = $conn->query($sql);
        echo $success;
    }
//    mysqli_close($conn);
}

function handleExpensesOnly($data)
{
    $searchQur = "";
    if (isset($data['search'])) {
        $search = $data['search'];
        $searchQur = " where 
        (a.date like '%$search%')
        OR (a.amount like '%$search%')
        OR (a.remarks like '%$search%')
        OR (a.`when` like '%$search%')
        ";
    }
    $qur = "
        select a.* from rwa_expenses a
        inner join rwa_members b on b.id=a.memid and a.amount<0 and b.isactive=1
        $searchQur
        order by `when` desc
    ";
    $rows = returnDataset($qur);
    echo $rows;
}

function showExpensesByMonth($data)
{
    $qur = "
        select 'Monthly Collection' as remarks,date,sum(amount) as amount
            from rwa_expenses
            where amount >0
            group by date
            Union All
            select 'Monthly Expenses',concat(MONTHNAME(`when`),' ',year(`when`)) as date,sum(amount) as amount
            from rwa_expenses
            where amount < 0
            group by concat(MONTHNAME(`when`),' ',year(`when`))
    ";
    $rows = returnDataset($qur);
    echo $rows;
}

function handleExpensesByMember($data)
{
    $qur = "select * from rwa_expenses where memid='${data['id']}' order by `when` desc";
    $rows = returnDataset($qur);
    echo($rows);
}

function handleExpensesGroupByMemId($data)
{
    global $conn;
    $name = $conn->real_escape_string($data['name']);
    $isAddressSet = isset($data['byaddress']);
    $orderBy = "";
    $orderBy = isset($data['byname']) ? " b.name asc" : $orderBy;
    $orderBy = isset($data['byamount']) ? " b.amount desc " : $orderBy;
    $orderBy = $isAddressSet ? " cast(b.address_number_sort as UNSIGNED) asc" : $orderBy;
//    $nameField = $isAddressSet ? "a.address" : "b.name";
//    $addrField = $isAddressSet ? "b.name" : "a.address";

    $searchByNameQur = "";
    if ($name <> '') {
        $searchByNameQur = " and (name like '%$name%' OR memkey like '%$name%' OR address like '%$name%' OR address_number_sort like '%$name%')";
    }
    $qur = "
    select b.id, b.name as name,b.type, b.memkey,b.address_number_sort, b.amount,a.when,a.address as address from rwa_members a right join (
        select m.id,m.name,m.type,m.memkey,round(m.address_number_sort,1) as address_number_sort,A.amount from (
           select m.id, sum(coalesce(amount, 0)) as amount
           from rwa_expenses e right outer join rwa_members m on e.memid = m.id
           where type<>'admin' and isactive=1  $searchByNameQur
           group by m.id
        ) A inner join rwa_members m ON A.id=m.id
        union all
        select 'expenses','z_expenses','','','',sum(coalesce(amount,0)) as amt from rwa_expenses where amount < 0
        union all
        select 'credits','z_credits','','','',sum(coalesce(amount,0)) as amt from rwa_expenses where amount > 0
        union all
        select 'members','z_members','','','',count(*) from rwa_members where type<>'admin'
       ) b on a.id=b.id
        order by $orderBy
        ";
    $rows = returnDataset($qur);
    echo $rows;
}


function handleLogin($data)
{
    global $failed, $conn;
    $user = $conn->real_escape_string($data['user']);
    $pass = $conn->real_escape_string($data['pwd']);
    $rows = returnDataset("select id,username,type,`when` from rwa_admin where username='$user' and password='$pass'");
    if (json_decode($rows, true)) {
        $sql = "update rwa_admin set signin=1 where username='$user' and signin=0";
        $result = $conn->query($sql);
        echo $rows;
    } else {
        echo $failed;
    }
}

function handleLogout($data)
{
    global $conn, $success, $failed;
    $id = $conn->real_escape_string($data['id']);
    $user = $conn->real_escape_string($data['user']);
    $sql = "update rwa_admin set signin=0 where id='$id' and username='$user' and signin=1";
    $result = $conn->query($sql);
    echo $success;
}

function handleKeyContacts($data)
{
    $keyContacts = returnDataset('select memkey,name,type from rwa_members where type<>"admin" and type<>"member" order by name');
    echo $keyContacts;
}


function handleShowRemindersInfo($data)
{
    $paymentDefaulters = returnDataset("
select A1.*,B1.amount
from (
         select A.*
         from (select distinct a.id,
                               a.name,
                               a.memkey,
                               a.type,
                               b.date,
                               substr(b.date, 1, 3)               as last,
                               substr(monthname(curdate()), 1, 3) as curMonth
               from rwa_members a
                        inner join rwa_expenses b on a.id = b.memid
               where type <> 'admin'
                 and MONTH(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                                       '%d-%b-%Y')) < MONTH(curdate())
                 and year(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                                      '%d-%b-%Y')) = year(curdate())
              ) A
                  left outer join (
             select distinct a.name, a.memkey
             from rwa_members a
                      inner join rwa_expenses b on a.id = b.memid
             where type <> 'admin'
               and MONTH(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                                     '%d-%b-%Y')) >= MONTH(curdate())
               and year(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                                    '%d-%b-%Y')) = year(curdate())
         ) B ON A.memkey = B.memkey
         where B.name is null
     ) A1
         LEFT JOIN (
    select memid, date, sum(amount) as amount from rwa_expenses group by memid, date
) B1 ON A1.id = B1.memid
Order by name
       ");
    echo $paymentDefaulters;
}


function loginCheck($data)
{
    global $failed, $conn, $success;
    $id = $conn->real_escape_string($data['id']);
    $user = $conn->real_escape_string($data['user']);
    $rows = returnDataset("select id,username,type,`when` from rwa_admin where id='$id' and username='$user' and signin=1");
    if (json_decode($rows, true)) {
        echo $success;
    } else {
        echo $failed;
    }
}

function handlePasswordChange($data)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $username = $conn->real_escape_string($data['user']);
    $password = $conn->real_escape_string($data['pwd']);
    $sql = "update rwa_admin set password='$password' where id='$id' and username='$username'";
    $result = $conn->query($sql);
    echo $success;
}

function handleDeleteMember($data)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $admin = $conn->real_escape_string($data['admin']);
    $adminId = $conn->real_escape_string($data['adminId']);
//    $sql = "update rwa_members set isActive=0 where id='$id'";
    $sql = "delete from rwa_members where id='$id'";
    $result = $conn->query($sql);
    echo $success;
}

function handleDeleteExpense($data)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $sql = "delete from rwa_expenses where id='$id'";
    $result = $conn->query($sql);
    echo $success;
}


function backupJSON($data)
{
    $expensesQur = '
        select a.id, rm.name, date, amount, remarks, a.`when`
        from rwa_expenses a
        inner join rwa_members rm on a.memid = rm.id
        where amount<0
        order by a.id desc    
    ';
    $collectionQur = '
        select a.id, rm.name, date, amount, remarks, a.`when`
        from rwa_expenses a
        inner join rwa_members rm on a.memid = rm.id
        where amount>0
        order by a.id desc    
    ';
    $members = returnDataset('select * from rwa_members order by id');
    $admin = returnDataset('select * from rwa_admin order by id');
    $expenses = returnDataset($expensesQur);
    $collection = returnDataset($collectionQur);
    $data = json_encode(array(
        "members" => json_decode($members),
        "admin" => json_decode($admin),
        "expenses" => json_decode($expenses),
        "collection" => json_decode($collection)
    ));
    echo $data;
}

function handleGetConfig($data)
{
    $config = returnDataset('select `key`,`value` from rwa_config where isactive=1');
    echo $config;
}