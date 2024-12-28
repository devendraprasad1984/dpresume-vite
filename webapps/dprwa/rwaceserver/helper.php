<?php

$res = [];

//define('APP_ROOT','http://localhost/web/posts-sample/');

//$loggedIn = false;
$success = json_encode(array('status' => 'success'));
$failed = json_encode(array('status' => 'failed, not allowed'));
$recordExists = json_encode(array('status' => 'success', 'msg' => 'Record already exists and Updated'));

function returnDataset($qur)
{
    ChromePhp::log($qur);
    global $conn;
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return json_encode($rows);
}


function handleSaveContribution($data, $orgid)
{
    global $success, $conn;
    $memid = $conn->real_escape_string($data['memid']);
    $time = $conn->real_escape_string($data['time']);
    $amount = $conn->real_escape_string($data['amount']);
    $remarks = $conn->real_escape_string($data['remarks']);
    $ip = 'ip & location';

    $sql = "INSERT INTO rwa_expenses(memid,date,amount,remarks,iploc,isdeleted,isapproved,orgid) values('$memid','$time','$amount','$remarks','$ip',0,1,'$orgid')";
    $result = $conn->query($sql);
    echo $success;
//    mysqli_close($conn);
}


function handleSaveExpense($data, $orgid)
{
    global $success, $conn;
    $amount = $conn->real_escape_string($data['amount']);
    $remarks = $conn->real_escape_string($data['reason']);
    $adminid = $conn->real_escape_string($data['adminid']);
    $amount = 0 - $amount;
    $adminRow = returnDataset("select id from rwa_members where memkey='admin' and type='admin'");
    $decoded = json_decode($adminRow);
    $baseadminid = $decoded[0]->id;
    $sql = "INSERT INTO rwa_expenses(memid,amount,remarks,isdeleted,orgid,adminid) values('$baseadminid','$amount','$remarks',0,'$orgid','$adminid')";
    $result = $conn->query($sql);
    echo $success;
//    mysqli_close($conn);
}


function handleSaveMember($data, $orgid)
{
    global $success, $conn, $recordExists;
    $memid = $conn->real_escape_string($data['memberid']);
    $name = $conn->real_escape_string($data['name']);
    $address = $conn->real_escape_string($data['address']);
    $type = $conn->real_escape_string($data['type']);
    $address_number_sort = $conn->real_escape_string($data['address_number_sort']);
    $pic = '';

    $result = returnDataset("select count(*) as count from rwa_members where memkey='$memid' and orgid='$orgid'");
    $count = json_decode($result)[0]->count;
    if ($count == 1) {
        $sql = "update rwa_members set name='$name',address='$address',type='$type',address_number_sort='$address_number_sort' where memkey='$memid' and orgid='$orgid'";
        $result = $conn->query($sql);
        echo $recordExists;
    } else {
        $sql = "INSERT INTO rwa_members(memkey,name,address,address_number_sort,pic,type,orgid) values('$memid','$name','$address','$address_number_sort','$pic','$type',$orgid)";
        $result = $conn->query($sql);
        echo $success;
    }
//    mysqli_close($conn);
}

function handleExpensesOnly($data, $orgid)
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
        select a.id, a.`when` as `when`, a.remarks, abs(a.amount) as amount from rwa_expenses a
        inner join rwa_members b on b.id=a.memid and a.amount<0 and b.isactive=1  and a.isdeleted=0 and a.orgid='$orgid'
        $searchQur
        order by `when` desc
    ";
    $rows = returnDataset($qur);
    echo $rows;
}

function showExpensesByMonth($data, $orgid)
{
    $qur = "
        select 'Monthly Collection' as remarks,date,sum(amount) as amount
            from rwa_expenses
            where amount >0 and isdeleted=0 and orgid='$orgid'
            group by date
            Union All
            select 'Monthly Expenses',concat(MONTHNAME(`when`),' ',year(`when`)) as date,sum(amount) as amount
            from rwa_expenses
            where amount < 0 and isdeleted=0 and orgid='$orgid'
            group by concat(MONTHNAME(`when`),' ',year(`when`))
    ";
    $rows = returnDataset($qur);
    echo $rows;
}

function handleExpensesByMember($data, $orgid)
{
    $qur = "select * from rwa_expenses where memid='${data['id']}' and isdeleted=0 and orgid='$orgid' order by `when` desc";
    $rows = returnDataset($qur);
    echo($rows);
}

function handleExpensesGroupByMemId($data, $orgid)
{
    global $conn;
    $search = $conn->real_escape_string($data['search']);
    $isAddressSet = isset($data['byaddress']);
    $isSummaryOnly = isset($data['summaryOnly']);
    $orderBy = "";
    $orderBy = isset($data['byname']) ? " b.name asc" : $orderBy;
    $orderBy = isset($data['byamount']) ? " b.amount desc " : $orderBy;
    $orderBy = $isAddressSet ? " cast(b.address_number_sort as UNSIGNED) asc" : $orderBy;
//    $nameField = $isAddressSet ? "a.address" : "b.name";
//    $addrField = $isAddressSet ? "b.name" : "a.address";

    $searchByNameQur = "";
    if ($search <> '') {
        $searchByNameQur = " and (name like '%$search%' OR memkey like '%$search%' OR address like '%$search%' OR address_number_sort like '%$search%')";
    }
    $qurSummary = "
        select 'expenses' as id,'z_expenses' as name,'','','',sum(coalesce(amount,0)) as amount from rwa_expenses where amount < 0 and isdeleted=0 and orgid='$orgid'
        union all
        select 'credits','z_credits','','','',sum(coalesce(amount,0)) as amt from rwa_expenses where amount > 0 and isdeleted=0 and orgid='$orgid'
        union all
        select 'members','z_members','','','',count(*) from rwa_members where type<>'admin' and orgid='$orgid'
    ";
    $qur = "
        select b.id, b.name as name,b.type, b.memkey,b.address_number_sort, coalesce(b.amount,0) as amount,a.when,a.address as address from rwa_members a right join (
        select m.id,m.name,m.type,m.memkey,round(m.address_number_sort,1) as address_number_sort,A.amount from (
           select m.id, sum(coalesce(amount, 0)) as amount
           from rwa_expenses e right outer join rwa_members m on e.memid = m.id  and m.isactive=1 and m.isactive=1 and e.isdeleted=0  and e.orgid='$orgid'
           where type<>'admin' $searchByNameQur
           group by m.id
        ) A inner join rwa_members m ON A.id=m.id
        union all
        $qurSummary
       ) b on a.id=b.id
        order by $orderBy
        ";
    $finalQuery = $isSummaryOnly ? $qurSummary : $qur;
    $rows = returnDataset($finalQuery);
    echo $rows;
}


function handleLogin($data)
{
    global $failed, $conn;
    $user = $conn->real_escape_string($data['user']);
    $pass = $conn->real_escape_string($data['pwd']);
    $passHash = password_hash($pass, PASSWORD_DEFAULT);
    $rows = returnDataset("select id,username,type,`when` from rwa_admin where username='$user' and password='$passHash'");
    if (json_decode($rows, true)) {
        $sql = "update rwa_admin set signin=1 where username='$user' and signin=0";
        $result = $conn->query($sql);
        echo $rows;
    } else {
        echo $failed;
    }
}

function handleLogout($data, $orgid)
{
    global $conn, $success, $failed;
    $id = $conn->real_escape_string($data['id']);
    $user = $conn->real_escape_string($data['user']);
    $sql = "update rwa_admin set signin=0 where id='$id' and username='$user' and signin=1 and orgid='$orgid'";
    $result = $conn->query($sql);
    echo $success;
}

function handleKeyContacts($data, $orgid)
{
    $keyContacts = returnDataset("select memkey,name,type from rwa_members where type<>'admin' and type<>'member' and orgid='$orgid' order by name");
    echo $keyContacts;
}


function handleShowRemindersInfo($data, $orgid)
{
    $paymentDefaulters = returnDataset("
select A1.name, A1.memkey as phone, sum(B1.amount) as total_contributed_amount
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
                   inner join rwa_expenses b on a.id = b.memid and b.isdeleted=0 and b.orgid='$orgid'
               where type <> 'admin'
                 and MONTH(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                   '%d-%b-%Y')) < MONTH(curdate())
                 and year(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                   '%d-%b-%Y')) = year(curdate())
              ) A
                  left outer join (
             select distinct a.name, a.memkey
             from rwa_members a
                      inner join rwa_expenses b on a.id = b.memid and b.isdeleted=0 and b.orgid='$orgid'
             where type <> 'admin'
                 and MONTH(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                 '%d-%b-%Y')) >= MONTH(curdate())
               and year(STR_TO_DATE(concat('01-', substr(b.date, 1, 3), '-', substr(b.date, 5, 8)),
                                    '%d-%b-%Y')) = year(curdate())
     ) B ON A.memkey = B.memkey
where B.name is null
    ) A1
    LEFT JOIN (
select memid, date, sum(amount) as amount from rwa_expenses where isdeleted=0 and orgid='$orgid' group by memid, date
    ) B1 ON A1.id = B1.memid and A1.date = B1.date
group by A1.name, A1.memkey
Order by name
       ");
    echo $paymentDefaulters;
}


function loginCheck($data, $orgid)
{
    global $failed, $conn, $success;
    $id = $conn->real_escape_string($data['id']);
    $user = $conn->real_escape_string($data['user']);
    $rows = returnDataset("select id,username,type,`when` from rwa_admin where id='$id' and username='$user' and signin=1 and orgid='$orgid'");
    if (json_decode($rows, true)) {
        echo $success;
    } else {
        echo $failed;
    }
}

function handlePasswordChange($data, $orgid)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $isadmin = $conn->real_escape_string($data['isadmin']);
    $password = $conn->real_escape_string($data['pwd']);
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    if ($isadmin == 1) {
        $sql = "update rwa_admin set password='$passwordHash' where id='$id' and orgid='$orgid'";
    } else {
        $sql = "update rwa_members set password='$passwordHash' where id='$id' and orgid='$orgid' and type<>'admin'";
    }
    $result = $conn->query($sql);
    echo $success;
}

function handleDeleteMember($data, $orgid)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $admin = $conn->real_escape_string($data['admin']);
    $adminId = $conn->real_escape_string($data['adminId']);
    $sql = "update rwa_members set isActive=0 where id='$id' and orgid='$orgid'";
//    $sql = "delete from rwa_members where id='$id' and orgid='$orgid'";
    $result = $conn->query($sql);
    echo $success;
}

function handleDeleteExpense($data, $orgid)
{
    global $success, $conn;
    $id = $conn->real_escape_string($data['id']);
    $sql = "update rwa_expenses set isdeleted=1 where id='$id' and orgid='$orgid'";
    $result = $conn->query($sql);
    echo $success;
}


function backupJSON($data, $orgid)
{
    $expensesQur = "
        select a.id, rm.name, date, amount, remarks, a.`when`
        from rwa_expenses a
        inner join rwa_members rm on a.memid = rm.id
        where amount<0 and a.isdeleted=0 and a.orgid='$orgid'
        order by a.id desc    
    ";
    $collectionQur = "
        select a.id, rm.name, date, amount, remarks, a.`when`
        from rwa_expenses a
        inner join rwa_members rm on a.memid = rm.id
        where amount>0 and a.isdeleted=0 and a.orgid='$orgid'
        order by a.id desc
    ";
    $members = returnDataset("select * from rwa_members where orgid='$orgid' order by id");
    $admin = returnDataset("select id,username,type,`when`, signin from rwa_admin where  orgid='$orgid' order by id");
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

function handleGetConfig($data, $orgid)
{
    $qurConfig = returnDataset("select `key`,`value` from rwa_config where isactive=1 and orgid='$orgid'");
    $qurOrg = returnDataset("select * from rwa_org where orgid='$orgid'");
    $data = json_encode(array(
        "config" => json_decode($qurConfig),
        "org" => json_decode($qurOrg),
    ));
    echo $data;
}