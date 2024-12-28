'use strict';
const dpMod = {};
dpMod.helper = {};
dpMod.nav = function () {
    return `<div id="navBar">
    <a href="#/" class="btn black">Home</a>
    <a href="#/about" class="btn black">About</a>
    <a href="#/contact" class="btn black">Contact</a>
    <a href="#/admin" class="btn black">Admin</a>
    <a href="#/grid" class="btn black">Grid</a>
    <a href="#/ui" class="btn black">UI</a>
</div>`
}

dpMod.routes = {}
dpMod.generateRoutes = function () {
    let {home, contact, about, admin, grid, ui} = dpMod;
    dpMod.routes = {
        '/': home,
        '/contact': contact,
        '/about': about,
        '/admin': admin,
        '/grid': grid,
        '/ui': ui,
    };
}

dpMod.ui = function (xid) {
    let listVals = ['field1','field2','field3','field4','field5','field6','field7','field8','field9','field10'];
    let currentTab = -1;
    dpMod.ui.checkList = function (curElm) {
        let curid=curElm.parentElement.parentElement.id;
        // let parentULClass = curElm.parentElement.parentElement.className;
        document.getElementById('xlabel').innerHTML = Object.values(dpMod.helper.checkList(curid));
    }
    dpMod.ui.nextPrev = function (step) {
        let tabs = document.getElementsByClassName('tab');
        Object.values(tabs).map(x => x.style.display = 'none');
        if (currentTab < 0 || currentTab >= tabs.length - 1) currentTab = -1;
        currentTab = (currentTab == -1 ? 0 : currentTab + step);
        if (currentTab >= 0 && currentTab <= tabs.length) tabs[currentTab].style.display = 'block';
        document.getElementById('submitBtn').style.display = (currentTab === tabs.length - 1) ? 'inline-block' : 'none';
    }
    dpMod.ui.testSubmit = function (cls) {
        let elms = Object.values(document.getElementsByClassName(cls)[0].elements);
        let formVals = {}
        elms.map(x => formVals[x.name] = x.value);
        console.log(formVals);
        alert('form data is being submitted, check console');
    }
    return `<div>
        <h2>UI Test</h2>
        <div>
        <div class="row">
            <ul class="checkListBox column" id="checkBox1">
            ${listVals.map((x, id) => `<li><input type="checkbox" id="ck_1_${id}" value="${x}" onclick="dpMod.ui.checkList(this)"/><label for="ck_1_${id}">${x}</label></li>`).join('')}
            </ul>
            <ul class="checkListBox column" id="checkBox2">
            ${listVals.map((x, id) => `<li><input type="checkbox" id="ck_2_${id}" value="${x}" onclick="dpMod.ui.checkList(this)"/><label for="ck_2_${id}">${x}</label></li>`).join('')}
            </ul>
            <ul class="checkListBox column" id="checkBox3">
            ${listVals.map((x, id) => `<li><input type="checkbox" id="ck_3_${id}" value="${x}" onclick="dpMod.ui.checkList(this)"/><label for="ck_3_${id}">${x}</label></li>`).join('')}
            </ul>
            </div>
            <div id="xlabel" style="overflow: auto; width:100%"></div>
            <div>
            <h2>Toggle Switch</h2>
            <label class="switch"><input type="checkbox"><span class="slider"></span></label>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label><br><br>
            <label class="switch"><input type="checkbox"><span class="slider round"></span></label>
            <label class="switch"><input type="checkbox" checked><span class="slider round"></span></label>
            <label><input type="checkbox" class="ios-switch bigswitch green" checked /><div><div></div></div></label>
            </div>
        </div>
        <div  class="box">
        <form class="regForm">
          <h1>Register:</h1>
          <div style="overflow:auto;">
            <div style="float:right;">
              <span class="btn red" id="submitBtn" onclick="dpMod.ui.testSubmit('regForm')" style="display: none">Submit</span>
              <span class="btn yellow" id="prevBtn" onclick="dpMod.ui.nextPrev(-1)">Previous</span>
              <span class="btn blue" id="nextBtn" onclick="dpMod.ui.nextPrev(1)">Next</span>
            </div>
          </div>
          <div class="tab"><h2>Name:</h2>
            <p><input placeholder="First name..." name="fname"></p>
            <p><input placeholder="Last name..." name="lname"></p>
          </div>
          <div class="tab"><h2>Contact Info:</h2>
            <p><input placeholder="E-mail..."  name="email"></p>
            <p><input placeholder="Phone..." name="phone"></p>
          </div>
          <div class="tab"><h2>Birthday:</h2>
            <p><input placeholder="dd" name="dd"></p>
            <p><input placeholder="mm" name="nn"></p>
            <p><input placeholder="yyyy" name="yyyy"></p>
          </div>
          <div class="tab"><h2>Login Info:</h2>
            <p><input placeholder="Username..." oninput="this.className = ''" name="uname"></p>
            <p><input placeholder="Password..." oninput="this.className = ''" name="pword" type="password"></p>
          </div>
          </form>
          </div>
    </div>`;
}

dpMod.onSaveClick = function (msg) {
    alert('i am ' + msg);
}

dpMod.home = function () {
    return `<div>
    <h2>Home</h2>
    <div>This is home I am fine</div>
    <div>
    <span class="btn primary" onclick="dpMod.onSaveClick('saved')">Save</span>
    <span class="btn red" onclick="dpMod.onSaveClick('clear')">Clear</span>
    </div>
    <div>
        <input type="month" id="triggerDate1" />
        <span class="btn grey" onclick="dpMod.helper.dateStep(-1)">Prev</span>
        <span class="btn brown" onclick="dpMod.helper.dateStep(1)">Next</span>        
    </div>
</div>`
}

dpMod.helper.dateStep = function (cnt) {
    if (cnt < 0)
        document.getElementById('triggerDate1').stepDown(Math.abs(cnt));
    else
        document.getElementById('triggerDate1').stepUp(cnt);
}

dpMod.grid = function () {
    dpMod.grid.handleApiData = function (cur, url) {
        let gridDiv = document.getElementById('myGrid');
        gridDiv.innerHTML = '<h1>loading, plz wait...</h1>';
        // let baseUrl='https://jsonplaceholder.typicode.com/';
        let baseUrl = 'offline/';
        dpMod.helper.webApi('get', baseUrl + url + '.json', [], function (data) {
            dpMod.helper.data = data;
            dpMod.grid.handleGridData(gridDiv, cur, data);
        }, function (er) {
            console.log(er);
            gridDiv.innerHTML = 'error while loading ' + er;
        });
    }
    dpMod.grid.handleGridData = function (gridDiv, cur, data) {
        // let xval = cur.innerHTML;
        let thisGridTab = gridDiv.id + "_table";
        // cur.innerHTML = 'loading...';
        let colKeys = Object.keys(data[0]);
        let fields = [];
        for (let i = 0; i < colKeys.length; i++) fields.push({name: colKeys[i]});
        let downloadButton = `<span class="btn yellow" onclick="dpMod.helper.generateCSV()">Export ${dpMod.helper.data.length}</span>`;
        let search = `<input type="text" id="myInput" class="search" onchange="dpMod.helper.filterData(this.value,'${thisGridTab}')" placeholder="Search.." />`;
        let header = `<tr class="headline">${fields.map(x => `<th>${x.name.toUpperCase()}</th>`).join('')}</tr>`;
        let body = '<div class="grid"><table id="' + thisGridTab + '">' + header + data.map((x, line) => `<tr>
            ${fields.map(f => `<td>${typeof x[f.name] === 'object' ? JSON.stringify(x[f.name]) : x[f.name]}</td>`).join('')
        }</tr>`).join('') + '</table></div>';
        gridDiv.innerHTML = downloadButton + search + body;
        // cur.innerHTML = xval;
    }
    return `<div>
    <h2>Grid</h2>
    <div>
        <span class="btn blue" onclick="dpMod.grid.handleApiData(this,'users');">users</span>
        <span class="btn blue" onclick="dpMod.grid.handleApiData(this,'posts')">posts</span>
        <span class="btn blue" onclick="dpMod.grid.handleApiData(this,'todos')">todo</span>
        <div id="myGrid"></div>
    </div>
</div>`
}

dpMod.helper.data = {};
dpMod.helper.filterData = function (cur, tableId) {
    // let fltr=dpMod.helper.data.filter(x=>x[p1].toLowerCase().indexOf(cur.value)!==-1);
    var table, tr, td, txtValue;
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (let j = 0; j < td.length; j++) {
            txtValue = td[j].textContent || td[j].innerText;
            let found = txtValue.toUpperCase().indexOf(cur.toUpperCase());
            tr[i].style.display = found !== -1 ? 'block' : 'none';
            if (found !== -1) break
        }
    }
}
dpMod.helper.selected={};
dpMod.helper.checkList = function (curid) {
    let local=[]
    local.push(curid);
    let x = document.getElementById(curid).getElementsByTagName('li');
    let ips = Object.values(x).map(li => li.querySelector('input[type=checkbox]:checked')).filter(x => x !== null);
    for (let i = 0; i < ips.length; i++)
        local.push([ips[i].value]);
    dpMod.helper.selected[curid]=local;
    return dpMod.helper.selected;
}
dpMod.helper.generateCSV = function () {
    let rowsArr = [];
    let rows = dpMod.helper.data;
    if (typeof rows === 'object') {
        let xr = [];
        for (let i in rows) {
            let row = rows[i];
            let line = []
            for (let r in row) {
                line.push(row[r]);
            }
            xr.push(line);
        }
        rowsArr = xr;
    } else {
        rowsArr = rows;
    }
    let delim = ',';
    // console.log(rowsArr);
    let csvContent = rowsArr.map(e => e.join(delim)).join("\n");
    var blob = new Blob([csvContent], {
        type: "application/csv;charset=utf-8;"
    });
    let fileName = 'download.csv';
    if (window.navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName); // FOR IE BROWSER
    } else {
        var link = document.createElement("a");
        var csvUrl = URL.createObjectURL(blob);
        link.href = csvUrl;
        link.target = '_blank';
        link.style = "visibility:hidden";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

dpMod.contact = function () {
    return `<div>
    <h2>Contact</h2>
    <div>This is Contact I am fine</div>
</div>`
}

dpMod.about = function () {
    let aboutUsers = ['user1', 'user2', 'user3'];
    return `<div>
    <h2>About</h2>
    <div>This is About Page</div>
<!--    <div>${aboutUsers.map(x => x).join('<br/>')}</div>-->
    <div>${aboutUsers.join('<br/>')}</div>
</div>`
}

dpMod.admin = function () {
    return `<div>
    <h2>Admin</h2>
    <div>This is Admin I am fine</div>
    <div id="id01" class="modal box">
    <form class="modal-content animate">
    <div class="imgcontainer">
      <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
      <img src="img_avatar2.png" alt="Avatar" class="avatar">
    </div>

    <div class="container">
      <label for="uname"><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required />
      <label for="psw"><b>Password</b></label><input type="password" placeholder="Enter Password" name="psw" required />
      <span class="btn green">Login</span>
      <label for="remember"><input type="checkbox" checked="checked" name="remember">Remember me</label>
    </div>
    <div class="container" style="background-color:#f1f1f1">
      <span onclick="document.getElementById('id01').style.display='none'" class="btn red">Cancel</span>
      <span class="psw"><a href="#">Forgot password?</a></span>
    </div>
    </form>
    </div>
</div>`
}

dpMod.mobilecheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
dpMod.toggleLeftPanel = function (e) {
    left.style.display = (left.style.display == 'none' ? 'block' : 'none');
}

dpMod.show = function (id2show) {
    id2show.style.display = 'block';
}

dpMod.hide = function (id2hide) {
    setTimeout(function () {
        id2hide.style.display = 'none';
    }, 300);
}

dpMod.isHtmlHttpTextTrue = function (x) {
    let ishtml = (x.indexOf('.html') !== -1) ? true : false;
    let ishttp = (x.indexOf('http') !== -1) ? true : false;
    let istxt = (x.indexOf('.txt') !== -1) ? true : false;
    return (ishtml || ishttp || istxt) ? true : false;
}

dpMod.helper.webApi = function (type, uri, data, resolve, reject) {
    let req = new XMLHttpRequest();
    req.onload = function () {
        var data = JSON.parse(this.response);
        if (req.status >= 200 && req.status < 400) {
            resolve(data);
        } else {
            req.onerror = reject(req.statusText);
        }
    }
    if (type === 'get') {
        req.open(type.toUpperCase(), uri, true);
        req.send();
    } else {
        req.open(type.toUpperCase(), uri, true);
        req.send(data);
    }
}

dpMod.handleOverlayContent = function (text, id) {
    loadID.style.display = 'block';
    // moveProgress();
    let overlayDiv = getById(idOverlay);
    let xobj = {text: text};
    let headerLine = '<h1>' + xobj.text + '</h1>';
    let contetnLine = '<div>';
    let ds = adhocDataSet[id];
    for (let i in ds) {
        let line = '<img class="dp" src="' + ds[i] + '"/>';
        contetnLine += '<div class="box">' + line + '</div>';
    }
    contetnLine += '</div>';
    let overlayContentDiv = getById(idOverlayContent);
    overlayContentDiv.innerHTML = headerLine + contetnLine;
    openNav(overlayDiv.id);
    loadID.style.display = 'none';
}

dpMod.openNav = function (divid, param) {
    let x = getById(divid);
    x.style.width = "100%";
    x.style.display = "block";
}

dpMod.closeNav = function (divid) {
    let x = getById(divid);
    x.style.width = "0%";
    x.style.display = "none";
}

dpMod.getById = function (id) {
    return document.getElementById(id);
};

dpMod.setActiveIcon = function (elm, url) {
    let nav = Object.values(elm.getElementsByTagName('a'));
    let matchIcon = nav.filter(x => x.hash === '#' + url)[0];
    matchIcon.className = 'btn active';
}
dpMod.generateRoutes();
dpMod.router = (evt) => {
    const url = window.location.hash.slice(1) || "/";
    const routeResolved = dpMod.routes[url];
    let navElm = dpMod.nav();
    let root = document.getElementById('root');
    root.innerHTML = navElm + '<br/>' + (routeResolved)(); //IIFE
    dpMod.setActiveIcon(root, url);
    dpMod.init(url);
};
dpMod.init=function(url){
    switch (url) {
        case '/ui':
            dpMod.ui.nextPrev(0); break;
        case '/grid':
            dpMod.grid.handleApiData(undefined,'users'); break;
        case '/admin':
            document.getElementById('id01').style.display='block'; break;
    }
}

// For first load or when routes are changed in browser url box.
window.addEventListener('load', dpMod.router);
window.addEventListener('hashchange', dpMod.router);
window.addEventListener('onpopstate', dpMod.router);
