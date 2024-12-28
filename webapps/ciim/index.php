<?php
require_once './backend/common.php'
?>

<html>

<head>
    <title>Devendra Prasad</title>
    <!--    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"/>-->
    <link rel="stylesheet" href="./libs/bootstrap.min.css"/>
    <link rel="stylesheet" href="frontend/custom.css"/>

</head>

<body class="container">
<h3 class="topHeading">
    <span>Sample Post and Reply Messaging Platform</span>
    <span style="float: right">@cyberr.co.in</span>
</h3>

<div style="font-size: 14px; font-weight: bold; margin-top: 5%;">
    sample userName: test@gmail.com, password: test
</div>

<div class="modal fade" id="registerModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Registration Form</h5>
            </div>
            <div class="modal-body">
                <input type="text" id="userName" class="form-control" placeholder="enter your name">
                <input type="text" id="userEmail" class="form-control" placeholder="enter your email">
                <input type="password" id="userPassword" class="form-control" placeholder="enter your password">
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal">Close</button>
                <button class="btn btn-primary" id="registerBtn" onclick="fnRegister(this)">Register</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="loginModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Login Form</h5>
            </div>
            <div class="modal-body">
                <input type="text" id="userLEmail" class="form-control" placeholder="your email">
                <input type="password" id="userLPassword" class="form-control" placeholder="your password">
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal">Close</button>
                <button class="btn btn-primary" id="loginBtn" onclick="fnLogin(this)">Login</button>
            </div>
        </div>
    </div>
</div>


<div class="row" style="margin-top: 50px;margin-bottom: 30px;">
    <div id="welcomeBar" class="col-md-12  welcomeMsg" align="right"></div>
</div>

<div class="row">
    <!--    --><?php //print_r($_SESSION)?>
    <div class="col-md-12" align="right">
            <textarea class="form-control" id="mainComment" placeholder="add new post" cols="30"
                      rows="2"></textarea><br>
        <button class="btn btn-primary" id="addComment" onclick="fnAddComments(this,false)">Submit</button>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <h2><b id="idNumComments">0 posts</b></h2>
        <div id="userComments"></div>
    </div>
</div>


<div class="row replyRow" style="display: none">
    <div class="col-md-12" align="right">
        <input type="text" class="customInput" id="replyComment" placeholder="add reply"/>
        <a class="click green" href="javascript:void()" id="addReply" onclick="fnAddComments(this,true)">Save</a>
        <a class="click red" href="javascript:void()" onclick="$('.replyRow').hide()">Close</a>
    </div>
</div>

<script src="./libs/jquery.min.js"></script>
<script src="./libs/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="./frontend/common.js"></script>
<script type="text/javascript" src="./frontend/posts.js"></script>
</body>

</html>
