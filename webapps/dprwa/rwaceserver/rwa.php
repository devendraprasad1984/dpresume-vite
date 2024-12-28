<?php
require_once './ChromePHP.php';
require_once './headers.php';
require_once './appjwt.php';
require_once './connect.php';
require_once './helper.php';

global $success, $conn, $failed;
try {
//    php jwts - https://github.com/firebase/php-jwt
    $reqMethod = $_SERVER['REQUEST_METHOD'];
    if ($reqMethod == 'POST') {
        $input = file_get_contents('php://input');
        $inputData = json_decode($input, true);
        $orgid = $inputData['orgid'];
        if (isset($inputData['saveContribution'])) handleSaveContribution($inputData, $orgid);
        if (isset($inputData['saveExpense'])) handleSaveExpense($inputData, $orgid);
        if (isset($inputData['addMember'])) handleSaveMember($inputData, $orgid);
        if (isset($inputData['loginCheck'])) handleLogin($inputData);
        if (isset($inputData['passwordChange'])) handlePasswordChange($inputData, $orgid);
        if (isset($inputData['deleteMember'])) handleDeleteMember($inputData, $orgid);
        if (isset($inputData['deleteExpense'])) handleDeleteExpense($inputData, $orgid);
    }

    if ($reqMethod == 'GET') {
        $orgid = $_GET['orgid'];
        if (isset($_GET['showReminders'])) handleShowRemindersInfo($_GET, $orgid);
        if (isset($_GET['keycontacts'])) handleKeyContacts($_GET, $orgid);
        if (isset($_GET['logout'])) handleLogout($_GET, $orgid);
        if (isset($_GET['loginCheck'])) loginCheck($_GET, $orgid);
        if (isset($_GET['backupJSON'])) backupJSON($_GET, $orgid);
        if (isset($_GET['expensesOnly'])) handleExpensesOnly($_GET, $orgid);
        if (isset($_GET['expensesByMonth'])) showExpensesByMonth($_GET, $orgid);
        if (isset($_GET['expensesByMember'])) handleExpensesByMember($_GET, $orgid);
        if (isset($_GET['expensesGroup'])) handleExpensesGroupByMemId($_GET, $orgid);
        if (isset($_GET['config'])) handleGetConfig($_GET, $orgid);
    }

    if ($conn) mysqli_close($conn);
} catch (Exception $ex) {
    if ($conn) mysqli_close($conn);
//    ChromePhp::error($ex->getMessage());
    echo $failed;
}
