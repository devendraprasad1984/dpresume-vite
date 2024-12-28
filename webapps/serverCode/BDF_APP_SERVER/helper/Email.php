<?php

    // Import PHPMailer classes into the global namespace
    // These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    // Load Composer's autoloader
//    require '../PHPMailer/src/Exception.php';
//    require '../PHPMailer/src/PHPMailer.php';
//    require '../PHPMailer/src/SMTP.php';

    // Base Controller for sending Email
    class Email{
        //load model
        public function sendMail($mailDetails){
            $mail = new PHPMailer(true);
//            ChromePhp::log('validating',$mail->validateAddress($mailDetails['email']));
            if (!$mail->validateAddress($mailDetails['email']) )
                return false;
            try {
                //Server settings
                //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                     // Enable verbose debug output
                $mail->isSMTP();                                            // Send using SMTP
                $mail->Host       = EMAIL_HOST;                       // Set the SMTP server to send through
                $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
                $mail->Username   = EMAIL_USERNAME;                    // SMTP username
                $mail->Password   = EMAIL_PASSWORD;                            // SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
                $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

                //Recipients
                $mail->setFrom(EMAIL_USERNAME,EMAIL_NAME);
                $mail->addAddress($mailDetails['email']);     // Add a recipient

                // Content
                $mail->isHTML(true);                                  // Set email format to HTML
                $mail->Subject = $mailDetails['subject'];
                $mail->Body    = $mailDetails['message'];
                if($mail->send()){
                    return true;
                }else{
//                    ChromePhp::log('mail couldnt be sent',$mail->ErrorInfo);
                    return false;
                }
            } catch (Exception $e) {
                //writeErrorLog($e);
                ChromePhp::log($e);
                return false;
            }

        }

    }
