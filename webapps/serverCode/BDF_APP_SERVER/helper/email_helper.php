<?php
    $styles=[
        "redtxt"=>"color:red;"
        ,"icon"=>"height:150px; width: 150px;"
    ];
    function sendEmail($data){
        global $styles;
        $thanksMsg='Thanks for using BDF';
        $send = new Email();
        $mailDetails = ['email' => $data['email']];
        $message = '<p>Dear User,</p>';

        if($data['emailtype'] == "query"){
            $mailDetails['subject'] = 'BDF Response';
            $message .= '<p>'.$thanksMsg.'</p>';
            $message .= '<p>Here is the response to your query...</p><br/>';
            $message .= '<b>QUERY....</b><br/>';
            $message .= "<p>".$data['query']."</p><br/><hr/>";
            $message .= '<b>RESPONSE....</b><br/>';
            $message .= "<p>".$data['mailbody']."</p><br/>";
            $message .= '</div>';
        } elseif($data['emailtype'] == "forgotMail"){
            $mailDetails['subject'] = 'BDF Forgot Mail Response';
            $message .= '<p>Welcome '.$data['name'].', '.$thanksMsg.'</p>';
            $message .= '<div><img src="'.$data['icon'].'" />';
            $message .= '<h2>Your password is <span style="'.$styles['redtxt'].'">'.$data['pwd'].'</span></h2>';
            $message .= '</div>';
            $message .= '</div>';
        }
        $message .= '<br style = "line-height:5;">';
        $message .= '<p>Thanks,<br>Team BDF (Business Disability Forum)</p>';
        $mailDetails['message'] = $message;
        if($send->sendMail($mailDetails)){
            return true;
        }else{
            return false;
        }

    }
