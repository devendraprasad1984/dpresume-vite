function setProfileAvtars() {
    CRUD.forgotMailer=(cur,name)=>{
        let old=cur.innerText;
        cur.innerText=plzwait;
        postData(config.posting,{forgot:1,name},(res)=>{
            if(res.status===successMsg) swal('Dear '+name+', your forgot mail has been sent to your registered mail id.');
            if(res.status!==successMsg) swal('Dear '+name+', pls contact admin, forgot mail could not be sent')
            cur.innerText=old;
        });
    }
    getData(config.adminUrl, (avtars) => {
        let profiles = [];
        // console.log('admins/',avtars);
        profiles.push(`
            <div class="overlay-content">
            <span class="grcolor3 center" style="font-size: 30px">Choose Your Avatar....</span>
            <div class="flexbox center">
            `);
        avtars.map(x => {
            profiles.push(`
                <div class="flexcard">
                    <div class="alignEvenColumn">
                    <img src="${x.icon}"  onclick="handleAvatarClick(this,'${x.name}')"/>
                    <span class="grcolor1" style="font-size: 15px">${x.name}</span>
                    <a class="grcolor2" style="font-size: 12px" onclick="CRUD.forgotMailer(this,'${x.name}')">forgot??</a>
                    </div>
                </div>
            `);
        });
        profiles.push(`
            </div>
            </div>
        `);
        overlayContainer.html(profiles.join(''));
    });
}

function handleAvatarClick(elm, avtarName) {
    CRUD.checkLogin = (cur) => {
        let pwd = $('#txtPassword').val();
        if (pwd === '') return;
        let old = cur.innerText;
        cur.innerText = plzwait;
        postData(config.posting, {login: 1, pwd, name: avtarName}, (res) => {
            if (res.status === successMsg) {
                initParam.loggedin = 1;
                initParam.sessionid = res.token;
                dpMod.initParam = initParam; //this var is working because of closure concept
                localStorage.setItem(localObjName, JSON.stringify(dpMod.initParam));
                cur.innerText = old;
                dpMod.what2RunOnInit();
                swal.close();
            } else {
                cur.innerText = old;
                alert(failMsg+' - incorrect password, plr try again or click forgot?');
            }
        });
    }
    let initParam = {name: avtarName};
    initParam.msg = `Welcome, ${initParam.name} <a style="font-size: 14px;" href="javascript:void(0)" onclick="handleSignout()">signout</a>`;
    let xdiv = document.createElement('div');
    xdiv.id = 'adminHandle';
    xdiv.style.width = '100%';
    xdiv.style.height = '500px';
    xdiv.style.overflow = 'auto';
    xdiv.style.position = 'relative';
    let xrow = `<div class="alignEvenColumn">
                <span><h2 class="purpletxt">Welcome, ${avtarName.toUpperCase()}</h2></span>
                <span><input style="width: 80%;" type="password" id="txtPassword" placeholder="enter your admin password" /></span>
                <span><button class="btn green" onclick="CRUD.checkLogin(this)">Login</button></span>
            </div>`;
    xdiv.innerHTML = xrow;
    swal({
        content: xdiv,
        button: 'Close'
    }).then(flag => swalRemover(xdiv));
}


function handleSignout() {
    postData(config.posting, {logout: 1, name: dpMod.initParam.name}, (res) => {
        if (res.status === successMsg) {
            localStorage.removeItem(localObjName);
            dpMod.initParam=undefined;
            leftMenu.html(null);
            rightContainer.html(null);
            $('#idUploadContents').html(null);
            setProfileAvtars();
            overlayContainer.show();
        } else {
            alert(failMsg);
        }
    });
}

