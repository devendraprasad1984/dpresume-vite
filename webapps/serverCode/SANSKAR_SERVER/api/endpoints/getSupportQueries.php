<?php
require_once '../include.php';
try {
    $data = $_GET;
    $id=$data['agentid'];
    $rows=pullTableRowsByQuery("select * from supportqueries a left join supportreplies b on a.id=b.supportid and a.agentid=$id");
    echo json_encode($rows);
} catch (Exception $ex) {
    echo json_encode($ex);
}

