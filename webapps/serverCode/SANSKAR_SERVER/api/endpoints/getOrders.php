<?php
require_once '../include.php';
try {
    $data = $_GET;
    $id = $data['agentid'];
    $type = $data['type'];
    $ord = "order by date desc";
    if ($type == 'history') {
        $whr = "where agentid=$id";
    } elseif ($type == '3m') {
        $whr = "where (TIMESTAMPDIFF(MONTH, date, NOW())<=3 or state<>'success') and agentid=$id";
    } elseif ($type == 'delivery') {
        $id = $data['boy'];
        $whr = "where deliveryby=$id and isdelivered='0' and handovercode<>'0'";
    } elseif ($type == 'handovercode') {
        $whr = "where agentid=$id and isdelivered='0' and handovercode<>'0'";
    }
    $qurMisc = "select a.*,concat(b.name,', ',b.mobile) as deliveryboy,ifnull(c.imgcnt,0) as icnt
                from miscorders a inner join deliveryboys b on a.deliveryby=b.id
                left outer join (select orderid,count(orderid) as imgcnt from orderimages group by orderid) c on c.orderid=a.id
                $whr $ord";
//    left outer join (select orderid,group_concat(uri,'~') as imgs from orderimages group by orderid) c on c.orderid=a.id

    $qurOrder = "select a.*,b.orderItems,concat(c.name,', ',c.mobile) as deliveryboy from orders a
            inner join (select orderid,group_concat(concat(qty,' pieces of ',p.name,' = ',calcline) separator '~') as orderItems 
            from orderitems oi inner join products p ON p.id=oi.prodid group by orderid) b on a.id=b.orderid
            inner join deliveryboys c on a.deliveryby=c.id
            $whr $ord";

    $rows = array();
    $misc = array();
    $orders = array();
    $misc = pullTableRowsByQuery($qurMisc);
    $orders = pullTableRowsByQuery($qurOrder);
    $rows['misc'] = $misc;
    $rows['orders'] = $orders;
    echo(json_encode($rows));
} catch (Exception $ex) {
    echo json_encode($ex);
}

