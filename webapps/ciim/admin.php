<?php
//session_start();
require_once './backend/adminHandle.php';
?>

<!doctype html>
<html lang="en">
<!--php n& REST: https://www.youtube.com/watch?v=OxdgtFs9Z_0-->
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Devendra Prasad</title>
    <link rel="stylesheet" href="./libs/bootstrap.min.css"/>
    <link rel="stylesheet" href="./frontend/custom.css"/>
</head>


<body class="">
<h3 class="topHeading">
    <span>Sample Post and Reply Messaging Platform</span>
    <span style="float: right">@Devendra Prasad</span>
</h3>

<div class="container-fluid" style="margin-top: 50px;margin-bottom: 30px;">
    <div id="welcomeBar" class="col-md-12  welcomeMsg" align="right"></div>
    <div class="row">
        <div class="col-md-12">
            <div class="">
                <a id="navHome" href="javascript:void(0)" onclick="clickHandler(this,'home')">Home</a>
                <a id="navUsers" href="javascript:void(0)" onclick="clickHandler(this,'users')">Users</a>
                <a id="navPosts" href="javascript:void(0)" onclick="clickHandler(this,'posts')">Posts</a>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <input id="searchBox" class="customInput purple" type="text" placeholder="search contents"/>
                        <a href="javascript:void(0)" class="btn bgblue" onclick="clickSearch(this)">Search</a>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div></div>
                        <div id="rightContents">
                            <div id="adminDashboardHome"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>


<script src="./libs/jquery.min.js"></script>
<script src="./libs/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="./frontend/common.js"></script>
<script type="text/javascript" src="./frontend/admin.js"></script>

</body>
</html>
