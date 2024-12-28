<?php
$styles = [
    "redtxt" => "color:red;"
    , "icon" => "height:150px; width: 150px;"
    , "btnred" => "background-color: #935ff3; color: white; padding: 10px 10px; text-align: center;text-decoration: none;  display: inline-block; font-size: 20px; opacity:0.80;"
];
function sendEmail($data)
{
    global $styles;
    $thanksMsg = 'Thanks for using ' . EMAIL_NAME;
    $send = new Email();
    $mailDetails = ['email' => $data['email']];
    $message = '<p>Dear User,</p>';

    if ($data['emailtype'] == "query") {
        $mailDetails['subject'] = EMAIL_NAME . ' Response';
        $message .= '<p>' . $thanksMsg . '</p>';
        $message .= '<p>Here is the response to your query...</p><br/>';
        $message .= '<b>QUERY....</b><br/>';
        $message .= "<p>" . $data['query'] . "</p><br/><hr/>";
        $message .= '<b>RESPONSE....</b><br/>';
        $message .= "<p>" . $data['mailbody'] . "</p><br/>";
        $message .= '</div>';
    } elseif ($data['emailtype'] == "forgotMail") {
        $mailDetails['subject'] = 'Forgot Mail Response';
        $message .= '<p>Welcome ' . $data['name'] . ', ' . $thanksMsg . '</p>';
        $message .= '<div><img src="' . $data['icon'] . '" />';
        $message .= '<h2>Your password is <span style="' . $styles['redtxt'] . '">' . $data['pwd'] . '</span></h2>';
        $message .= '</div>';
        $message .= '</div>';
    } elseif ($data['emailtype'] == "forgotAgentMail") {
        $mailDetails['subject'] = EMAIL_NAME . ' Forgot Mail Response';
        $message .= '<p>Welcome ' . $data['name'] . ', ' . $thanksMsg . '</p>';
        $message .= '<h2>Your password is <span style="' . $styles['redtxt'] . '">' . $data['guid'] . '</span></h2>';
        $message .= '<div>is your account compromised, set up new <a href="#" style="' . $styles['btnred'] . '">Proceed</a></div>';
        $message .= '</div>';
        $message .= '</div>';
    }
    $message .= '<br style = "line-height:5;">';
    $message .= '<p>Thanks,<br>Team '.EMAIL_NAME.'</p>';
    $mailDetails['message'] = $message;
    if ($send->sendMail($mailDetails)) {
        return true;
    } else {
        return false;
    }

}
