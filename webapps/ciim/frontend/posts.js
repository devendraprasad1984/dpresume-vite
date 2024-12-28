let commentId = 0;
let userComments = $('.userComments');
sessionData = localStorage.getItem('session') !== null ? JSON.parse(localStorage.getItem('session')) : undefined;

$(document).ready(function () {
    // $('#registerBtn').on('click', fnRegister);
    // $('#loginBtn').on('click', fnLogin);
    listComment();
})

function validateEmptyVal(caller) {
    if (caller.val() === "") {
        caller.css('border', '1px solid purple');
        return false;
    } else {
        caller.css('border', '');
    }
    return true;
}


function fnRegister(caller) {
    console.log(caller);
    let name = $('#userName');
    let email = $('#userEmail');
    let password = $('#userPassword');
    if (validateEmptyVal(name) && validateEmptyVal(email) && validateEmptyVal(password)) {
        let oldVal=$(caller).html();
        $(caller).html('please wait...');
        $.ajax({
            url: 'index.php',
            method: 'post',
            dataType: 'text',
            data: {
                register: 1,
                name: name.val()
                , email: email.val()
                , password: password.val()
            },
            success: function (response) {
                // console.log(response);
                if (response === 'failedEmail') {
                    $(caller).html(oldVal);
                    alert('plz insert valid email');
                } else if (response === 'failedUserExists') {
                    $(caller).html(oldVal);
                    alert('user already exist');
                } else {
                    $.ajax({
                        url: './backend/sendMail.php',
                        method: 'post',
                        datatype: 'json',
                        data: {
                            sendmail: 1
                            , name: name.val()
                            , email: email.val()
                        }, success: function (response) {
                            $(caller).html(oldVal);
                            alert(JSON.parse(response).status);
                        }
                    });//send welcome email
                    // alert('you have been registered, once approved, you will be notified');
                    //window.location = window.location;
                }
            },
            error: function (response) {
                console.log(response);
                userComments.html(response);
            }
        });
    }
}


function fnLogin(caller) {
    let email = $('#userLEmail');
    let password = $('#userLPassword');
    if (validateEmptyVal(email) && validateEmptyVal(password)) {
        let oldVal=$(caller).html();
        $(caller).html('please wait...');
        $.ajax({
            url: 'index.php',
            method: 'post',
            dataType: 'text',
            data: {
                login: 1,
                email: email.val()
                , password: password.val()
            },
            success: function (response) {
                // console.log(response);
                if (response.indexOf('failed') !== -1) {
                    alert('plz check your login details or contact admin for approval');
                } else {
                    sessionData = response;
                    // localStorage.setItem(session, sessionData);
                    localStorage.setItem('session', sessionData);
                    $(caller).html(oldVal);
                    window.location = window.location;
                }
            },
            error: function (response) {
                console.log(response);
                userComments.html(response);
            }
        });
    }
}

function postReply(caller, id) {
    commentId = id;
    $(".replyRow").insertAfter(caller);
    $(".replyRow").show();
}

function fnAddComments(caller, isReply) {
    if (typeof sessionData === "undefined" || sessionData === null) {
        alert('you are not logged in');
        return;
    }
    // $("#comment-message").css('display', 'none');
    let comment = isReply ? $('#replyComment').val() : $('#mainComment').val();
    $.ajax({
        url: "./backend/addPosts.php",
        data: {
            comment_id: commentId,
            comment,
            loggedIn: sessionData.loggedIn,
            userid: sessionData.userid
        },
        type: 'post',
        success: function (response) {
            commentId = 0;
            if (response === 'success') {
                // $("#comment-message").css('display', 'inline-block');
                commentId = 0
                if (!isReply) {
                    // $('#userComments').prepend(response);
                    $('#mainComment').val("");
                } else {
                    $('#replyComment').val("");
                    $(".replyRow").hide();
                    // $(".replyRow").parent().next().append(response);
                }
                // listComment();
                window.location = window.location;
            } else {
                alert("Failed to add comments !");
                return false;
            }
        }
    });
};

function listComment() {
    $.post("./backend/fetchPosts.php",
        function (data) {
            if (data.length === 0) {
                $("#idNumComments").html('Login to view Posts');
                return;
            }
            data = JSON.parse(data);
            $("#idNumComments").html(data.length.toString() + ' Messages Found');
            let comments = "";
            let parent = -1;
            var list = $("<ul>");
            let item = $("<li>").html(comments);
            for (let i = 0; (i < data.length); i++) {
                // console.log('posts',data[i]);
                let commentId = data[i]['comment_id'];
                parent = data[i]['parent_comment_id'];
                if (parent == "0") {
                    comments = "<div class='comment'>" +
                        "<div class='userCommentTitle'><span>" + data[i]['name'] + " </span> <span class='time'>" + data[i]['date'] + "</span></div>" +
                        "<div class='userComment'>" + data[i]['comment'] + " <a href='javascript:void(0)' class='blue' onClick='postReply(this," + commentId + ")'>Reply</a></div>" +
                        "</div>";

                    let item = $("<li>").html(comments);
                    list.append(item);
                    let reply_list = $('<ul>');
                    item.append(reply_list);
                    listReplies(commentId, data, reply_list);
                }
            }
            $("#userComments").html(list);
        });
}

function listReplies(commentId, data, list) {
    for (let i = 0; (i < data.length); i++) {
        // console.log('replies',data[i]);
        if (commentId == data[i].parent_comment_id) {
            let comments = "<div class='comment'>" +
                "<div class='userReplyTitle'><span class='time-reply'>" + data[i]['pname'] + ', ' + data[i]['date'] + "</span></div>" +
                "<div class='userComment-reply'><span>" + data[i]['comment'] + "</span> <a href='javascript:void(0)' class='purple' onClick='postReply(this," + data[i]['comment_id'] + ")'>Reply</a></div>" +
                "</div>";
            let item = $("<li>").html(comments);
            let reply_list = $('<ul>');
            list.append(item);
            item.append(reply_list);
            listReplies(data[i].comment_id, data, reply_list);
        }
    }
}