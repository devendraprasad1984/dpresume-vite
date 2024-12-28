<?php
include "../common/headers.php";
include "../common/helper.php";

global $success, $conn, $failed;
try {
    $reqMethod = $_SERVER['REQUEST_METHOD'];
    if ($reqMethod == 'POST') {
        $input = file_get_contents('php://input');
        $inputData = json_decode($input, true);
        if (isset($inputData['dpFeedbackSave'])) handleFeedbackSave($inputData);
        if (isset($inputData['dpFeedbackDelete'])) handleFeedbackDelete($inputData);
    }

    if ($reqMethod == 'GET') {
        if (isset($_GET['getDpFeedback'])) getFeedbacksAnonymous($_GET);
    }

    if ($conn) mysqli_close($conn);
} catch (Exception $ex) {
    if ($conn) mysqli_close($conn);
    echo $failed;
}

