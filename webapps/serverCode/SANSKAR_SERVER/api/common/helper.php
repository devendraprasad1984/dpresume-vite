<?php
$nodatafound = "no data found or some fetch error, contact admin";

function pullTableRows($table, $where = '', $orderBy = '', $fld = '*')
{
    global $conn;
    $qur = "select $fld from $table $where $orderBy";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
    return $rows;
}

function pullTableRowsByQuery($query)
{
    global $conn;
    $sql = $conn->query($query);
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

function pullTable($table, $where = '', $orderBy = '', $fld = '*')
{
    global $conn;
    $qur = "select $fld from $table $where $orderBy";
    $sql = $conn->query($qur);
    $rows = $sql->fetch_all(MYSQLI_ASSOC);
    mysqli_free_result($sql);
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
    $agentid = $conn->real_escape_string($data['agentid']);
    $query = "insert into supportqueries(name, mobile, email, query, agentid) values('$name','$mobile','$email','$queries',$agentid)";
    $result = $conn->query($query);
    if ($conn) mysqli_close($conn);
//    $response['query']=$query;
//    echo json_encode($response);
    echo $result ? $success : $failed;
}

function handleOrderSave($data)
{
    global $conn, $success, $failed;
    $type = $conn->real_escape_string($data['type']);
    $agentid = $conn->real_escape_string($data['id']);
    $address = $conn->real_escape_string($data['address']);
    $result = false;
    $ordsave = false;
    $orddet = false;
    if ($type == 'misc') {
        $orders = $conn->real_escape_string($data['orders']);
        $remarks = $conn->real_escape_string($data['remarks']);
        $query = "insert into miscorders(agentid, orderItems, remarks,address) values($agentid,'$orders','$remarks','$address')";
        $result = $conn->query($query);
    } elseif ($type == 'orderimages') {
        $remarks = $conn->real_escape_string($data['remarks']);
        $files = $data['files'];
        $names = $files['name'];
        $tmpnames = $files['tmp_name'];
        $types = $files['type'];
        $sizes = $files['size'];
        $result = false;
        $query = "insert into miscorders(agentid, orderItems, remarks,ordertype,prefix,address) values($agentid,'order images uploaded','$remarks','image','X','$address')";
        $conn->query($query);
        $orderid = pullTableRowsByQuery('select max(id) as id from miscorders')[0]['id'];
        foreach ($names as $k => $v) {
            $fn = time() . '_' . $names[$k];
            $abspath = UPLOAD_DIR . "/" . $fn;
            $uri = UPLOAD_URL . "/" . $fn;
            $ismoved = move_uploaded_file($tmpnames[$k], $abspath);
            if ($ismoved) {
                $qur = "insert into orderimages (orderid,abspath, uri) VALUES($orderid ,'$abspath', '$uri')";
                $conn->query($qur);
            }
            $result = true;
        }
    } elseif ($type == 'order') {
        $orders = $data['orders'];
        $amount = $conn->real_escape_string($data['cartAmount']);
        $remarks = $conn->real_escape_string($data['remarks']);
        $ordQur = "insert into orders(agentid,ordervalue,remarks,address) values($agentid,$amount,'$remarks','$address')";
        $ordsave = $conn->query($ordQur);
        if ($ordsave) {
            $orderid = pullTableRowsByQuery('select max(id) as id from orders')[0]['id'];
            foreach ($orders as $o) {
                $p0 = $o['id'];
                $p1 = $o['price'];
                $p2 = $o['qty'];
                $p3 = $o['tax'];
                $p4 = $o['discount'];
                $p5 = $o['amount'];
                $p6 = $o['xline'];
                $detqur = "insert into orderitems(prodid,orderid,price,qty,tax,discount,amount,calcline)
                    values($p0,$orderid,$p1,$p2,$p3,$p4,$p5,'$p6')";
                $orddet = $conn->query($detqur);
            }
        }
        $result = $ordsave && $orddet;
    }
    if ($conn) mysqli_close($conn);
    echo $result ? $success : $failed;
}

function deliveryOrder($data)
{
    global $conn;
    $out = array();
    $id = $conn->real_escape_string($data['id']);
    $prefix = $conn->real_escape_string($data['prefix']);
    $code = $conn->real_escape_string($data['code']);
    if ($prefix == 'M' || $prefix == 'X')
        $table = "miscorders";
    elseif ($prefix == 'A')
        $table = "orders";
    $selRow = pullTableRows($table, "where id=$id and handovercode='$code'", '', "count(*) as cnt");
    if ($selRow[0]['cnt'] == 0) {
        $out['status'] = 'invalid code, try again.';
    } else {
        $query = "update $table set state='delivered',isdelivered=1 where id=$id and handovercode='$code'";
        $res=$conn->query($query);
        $out['status'] = $res?'success':'failed';
    }
    if ($conn) mysqli_close($conn);
    echo json_encode($out);
}

function handleCancelOrder($data)
{
    global $conn, $success, $failed;
//    $successX = ["status" => "success"];
//    $successX['data'] = $data;
    $isCancel = $data['cancel'];
    $type = $data['type'];
    $id = $data['id'];
    $agentid = $data['agentid'];
    $result = false;
    if ($type == 'misc') {
        $qur = "update miscorders set state='cancellation underway' where id=$id and agentid=$agentid";
        $result = $conn->query($qur);
    }
    if ($conn) mysqli_close($conn);
//    echo json_encode($successX);
    echo $result ? $success : $failed;
}


function handleAgentValidation($data)
{
    global $conn, $failed;
    $isAgent = $data['agent'];
    $isValidate = $data['validate'];
    $result = false;
    $success1 = ['status' => 'success'];
    if ($isAgent == 1 && $isValidate == 1) {
        $guid = $data['pin'];
        $isOk = ifExists('dealers', "where guid='$guid'")[0]['num'];
        if ($isOk == "1") {
            $row = pullTableRowsByQuery("select a.*,a2.type as xtype,concat(address,', ',city,', ',country,', ',pincode,', ',landmark) as addr from dealers a inner join agenttype a2 on a.type = a2.id where a.guid='$guid'")[0];
            $success1["info"] = $row;
            $result = true;
        }
    }
    if ($conn) mysqli_close($conn);
    echo $result ? json_encode($success1) : $failed;
}


function handleForgotAgentCode($data)
{
    global $conn, $failed, $success;
    $isAgent = $data['agent'];
    $isForgot = $data['forgot'];
    if ($isAgent == 1 && $isForgot == 1) {
        $successUpdated = array('status' => 'success');
        $successUpdated['data'] = $data;
        $pin = $data['pin'];
        $isOk = ifExists('dealers', "where agentid='$pin'")[0]['num'];
        $successUpdated['isok'] = $isOk;
        $result = false;
        if ($isOk == "1") {
            $rows = pullTableRows('dealers', "where agentid='$pin'")[0];
            $successUpdated['rows'] = $rows;
            $objMail = ['emailtype' => 'forgotAgentMail'];
            $objMail['name'] = $rows['agentid'] . ' / ' . $rows['name'];
            $objMail['guid'] = $rows['guid'];
            $objMail['agentid'] = $rows['agentid'];
            $objMail['email'] = $rows['email'];
            $successUpdated['objmail'] = $objMail;
            $result = sendEmail($objMail);
        }
    }
    if ($conn) mysqli_close($conn);
    echo $result ? $success : $failed;
//    echo json_encode($successUpdated);
}





