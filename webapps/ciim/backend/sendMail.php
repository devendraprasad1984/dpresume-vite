<?php
require_once 'init.php';

use PHPMailer\PHPMailer\PHPMailer;

if (isset($_POST['sendmail']) && isset($_POST['name']) && isset($_POST['email']) && $_POST['sendmail'] == 1) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = 'Welcome to IBDN member list';
    $redirectURI=APP_ROOT.'api/contactus/'.str_replace(' ','', $name);
    $body = '<pre>
    Hi '.$name.',
    
    Thanks for signing up, Once approved, you will be notified.
    
    <a href="'.$redirectURI.'">Click to Reach IDBN Desk</a>
    </pre>';

    require_once 'PHPMailer/PHPMailer/PHPMailer.php';
    require_once 'PHPMailer/PHPMailer/SMTP.php';
    require_once 'PHPMailer/PHPMailer/Exception.php';

    $mail = new PHPMailer();
    //smtp settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'devendraprasad1984@gmail.com';
    $mail->Password = 'Rbs6200#';
    $mail->Port = 465; //for tls 587
    $mail->SMTPSecure = 'ssl'; //tls

    //turn on less secure setting by activating it here
    //https://myaccount.google.com/u/0/lesssecureapps?pli=1
    //email settings
    $mail->isHTML(true);
    $mail->setFrom($email, $name);
    $mail->addAddress('devendraprasad1984@gmail.com');
    $mail->Subject = $subject;
    $mail->Body = $body;

    if ($mail->send()) {
        $res = 'mail has been sent';
    } else {
        $res = 'something is wrong ' . $mail->ErrorInfo;
    }
    exit(json_encode(array('status' => $res)));

}

?>
