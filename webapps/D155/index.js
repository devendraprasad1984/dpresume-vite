let dataObject = {};
let summaryObject1 = {};
let colors = ['pink', 'green', 'gray', 'goldenrod', 'navy', 'blue', 'magenta']
let imgObj = {
    anish: 'images/anish.png'
    , dp: 'images/dp.png'
    , dev: 'images/dev.png'
    , ajay: 'images/ajay.png'
}
let curObj = {}
let searchBtn = $('#idSearchBtn');
let colorx='#428bdb';

function changeView(type){
    let divx=$('#divLines');
    if(type==='grid'){
        divx.removeClass('flexbox');
        divx.addClass('flexgrid');
    }else if(type==='card'){
        divx.removeClass('flexgrid');
        divx.addClass('flexbox');
    }
}


function handleUnlock(id) {
    let oldval = $('#' + id).html();
    $('#' + id).html('Please Wait...');
    let pass = prompt('enter passphrase');
    if (pass !== '6200') {
        $('#' + id).html(oldval);
        return;
    } else {
        formInputs.classList.remove('hide');
        $('#' + id).html(oldval);
    }
}

function postData(url = '', data = {}, success, error) {
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data,
        success,
        error
    });
}

function getData(url = '', success, error) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        success,
        error
    });
}

function getRandomBorderColor() {
    let ln = colors.length;
    let num = Math.round(Math.random() * ln, 0);
    // console.log(ln,num,colors[num]);
    return colors[num];
}

function cardClick(cur) {
    let cardid = cur.id;
    if(typeof cur==='string'){
        cardid=cur;
    }
    let xdiv = document.createElement('div');
    xdiv.id='openCardId';
    xdiv.innerHTML = document.getElementById(cardid).innerHTML;
    xdiv.className='carddiv';
    Array.from(xdiv.children).map(a=>a.classList.remove('amt'));
    swal({
        content: xdiv,
        button: 'Close'
    }).then(flag=> {
        xdiv.remove();
        let overlayContainer=Array.from(document.getElementsByClassName('swal-overlay'));
        overlayContainer.map(x=>x.remove());
    });

    // let xdivmain = document.getElementsByClassName('swal-modal');
    // xdivmain.style.width='80%';
    // xdivmain.style.height='80%';

}

let partDateTime=(strDateTime)=>{
    let sdateArr=strDateTime.split(' ');
    let sDate=sdateArr[0];
    let sTime=sdateArr[1];
    return '<span><span style="color: '+colorx+'">'+sDate+'</span><span class="time">'+sTime+'</span></span>';
}

let success = {
    alert: function (res) {
        let isaved = res.status === 'success' ? true : false;
        swal({
            title: isaved ? "Action Processed" : "Not Processed",
            icon: isaved ? "success" : "error",
            button: 'Ok',
        }).then(flag => getSummaryAndRefresh());
    }, refresh: function (res) {
        dataObject = res;
        let result = [];
        let total = 0;
        result = res.map((x, i) => {
            total += parseFloat(x.amount);
            let isnegative = x.amount < 0 ? true : false;
            return '<div id="card' + i + '" class="card" onclick="cardClick(this)" xtype="'+(isnegative?'-':'+')+'">' +
                '<span style="float: right">' +
                '<button class="btn red" onclick="handleDelete(' + x.id.trim() + ')">Delete</button>' +
                '</span>' +
                '<span><img src="' + imgObj[x.name] + '" class="imgdrop"/></span>' +
                '<span>' + partDateTime(x.when) + ' <span style="color:'+colorx+'">' + x.date + '</span></span>' +
                '<span class=" ' + (isnegative ? 'red' : '') + '">₹' + Math.abs(x.amount)+' ('+ x.remarks + ')</span>' +
                '</div>';
        });
        result.splice(0, 0, '<div  id="summaryFundCard"  xtype="+" onclick="cardClick(this)" class="column card" style="font-weight: bolder; font-size: 20px;">Current Fund Value: ' + '₹' + total + '<br><span style="font-size: 10px; color: gray">red: DEBITS, green: CREDIT</span></div>');
        let rowx = '<div id="summaryCard"  onclick="cardClick(this)" class="row card summarycard" style="font-size: 20px;">' +
            '<div style="font-weight: bolder">Contribution Summary</div>' +
            summaryObject1.map(x => {
                return '<span style="font-size: 40px" class="column">'
                    + (typeof imgObj[x.name]==='undefined'
                    ? x.name
                    : '<img class="imgdropx" src="'+imgObj[x.name]+'"/>')
                    +'<span class="amt" style="font-size: 40px"> ₹'+Math.abs(x.amt)+'</span>' +
                    '</span>';
            }).join('') +
            '</div>';
        report1.innerHTML = rowx + '<div id="divLines" class="flexgrid">' + result.join('') + '</div>';
        //change randonw broderTop color
        Array.from($('.card')).map((x, i) => x.style.borderTop = '3px solid ' + (x.getAttribute('xtype')==='+'?'green':'red'));
    }
}

function error(err) {
    swal({
        title: "some error contact admin",
        button: 'Ok',
    });
    console.log(err);
}

function handleDelete(id) {
    let pass = prompt('enter passphrase');
    if (pass !== '6200') return;

    data = {};
    data['delete'] = 1;
    data['id'] = id;
    swal(
        {
            title: "Are you sure to delete.",
            icon: 'error',
            text: 'please review entry before deleting',
            buttons: ['No', 'Yes'],
        }
    ).then((flag) => {
        if (flag === true) {
            postData('./d155.php', data, success.alert, error);
        }
    });

}


function handleSubmit(id) {
    let cur = $('#' + id);
    let oldval = cur.html();
    cur.html('please wait...');
    data = {};
    data['save'] = 1;
    data['name'] = names.value;
    data['time'] = time.value;
    data['amount'] = amount.value;
    data['remarks'] = remarks.value === "" ? "regular maintenance" : remarks.value;

    swal(
        {
            title: "Are you sure to save.",
            text: '"' + data['name'] + '" has entered amount "' + data['amount'] + '" for month of "' + data['time'] + '" and this is what it is for "' + data['remarks'] + '"',
            buttons: ['No', 'Yes'],
        }
    ).then((flag) => {
        if (flag === true) {
            curObj.submit = cur;
            curObj.submitText = oldval;
            postData('./d155.php', data, success.alert, error);
        } else {
            cur.html(oldval);
        }
    });
}

function getSummaryAndRefresh() {
    getData('./d155.php?summary1=1', (res) => {
        summaryObject1 = res;
        handleRefresh();
    });
}

function handleRefresh() {
    // searchBtn.html('Please Wait...');
    let oldval = searchBtn.html();
    report1.innerHTML = '<h1>please wait, loading...</h1>';
    let txt = idSearchBox.value.toLowerCase();
    getData('./d155.php?expenses=1&by=' + txt, success.refresh, error);
    // searchBtn.html(oldval);
    if (typeof curObj.submit !== "undefined") {
        curObj.submit.html(curObj.submitText);
        curObj.submit = undefined;
    }
}

function preparePeriod() {
    let years = [];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let curDate = new Date();
    let curPeriod = months[curDate.getMonth()] + ' ' + curDate.getFullYear();
    for (let i = 2020; i < 2025; i++) {
        years.push(months.map(x => {
            let cval = x + ' ' + i;
            let xelem = cval === curPeriod ? '<option value="' + cval + '" selected>' + cval + '</option>' : '<option value="' + cval + '">' + cval + '</option>';
            return xelem
        }).join(''));
        // years.push('<option value="'+i+'">'+i+'</option>');
    }
    time.innerHTML = years.join('');
}

function searchByKeyword(e) {
    if (e.keyCode === 13) {
        getSummaryAndRefresh();
        e.preventDefault();
    }
}

function sendMsg() {
    let data = {};
    data['whatsapp'] = 1;
    data['msg'] = 'this is a test message';
    postData('./d155.php', data, (res) => {
        console.log('from server', res)
    }, (err) => {
        console.error(err);
    });
}


(function () {
    preparePeriod();
    // handleRefresh()
    getSummaryAndRefresh();
})();
