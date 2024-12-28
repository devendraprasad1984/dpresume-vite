//js to read html attribues
let global = {};
global.getApiFunc = function (bnd, th, url,fld) {
    fld=fld||[];
    fld=fld.indexOf('~')!==-1 ? fld.split('~') :fld;
    document.getElementById(bnd+'_data').innerHTML='';
    let x = th.innerHTML;
    th.innerHTML = 'Loading Data, plz wait...';
    fetch(url).then(res => res.json()).then(res => {
        let allFields=Object.keys(res[0]); //if field is not define, display all fields
        fld= (fld.length===0 ? allFields : fld);
        document.getElementById(bnd+'_data').innerHTML =res.map(x => `<li>${fld.map(f=>x[f]).join(' | ')}</li>`).join('');
        th.innerHTML = x;
    });
}
window.processData = function (p1, p2) {
    // console.log('p1-p2',p1,p2);
    // console.log(gcontext);
    let {id, name, data, autopull, updateWithData, replaceWithApi} = gcontext;
    let curElm=document.getElementById(id);
    let xdata=JSON.parse(data);
    data = xdata['data'];
    let fields=xdata['fields'];
    let buttonPull = (autopull === 'false' && replaceWithApi !== null ) ? `<button onclick="global.getApiFunc('${id}',this,'${replaceWithApi}','${fields.join('~')}')">Fetch ${name}</button>` : '';
    let oldVal = buttonPull + '<br/>' +curElm.innerHTML + `<br/>`;
    if (replaceWithApi !== null && autopull === 'false') {
        curElm.insertAdjacentHTML('afterbegin',buttonPull);
        // curElm.innerHTML = oldVal + `<br/>`;
    } else if (replaceWithApi !== null && autopull === 'true') {
        global.getApiFunc(id,this,replaceWithApi,fields);
    }  else {
        curElm.innerHTML = oldVal + (updateWithData==='true') ? data.map(x => `<li>${x}</li>`).join('') : '';
    }
}

let tags = document.getElementsByTagName('dpTag');
for (let i = 0; i < tags.length; i++) {
    // let attrs=curTag.getAttributeNames();
    let curTag = tags[i];
    let id = curTag.getAttribute('id');
    curTag.insertAdjacentHTML('afterbegin',`<div id='${id+'_data'}' class="data_div"><h3>data goes here</h3></div>`);
    // curTag.append(`<div id='${id+'_data'}'>data goes here</div>`);
    let name = curTag.getAttribute('name');
    let fnname = curTag.getAttribute('fn')||'processData()';
    let data = curTag.getAttribute('data')||'{"data":[],"fields":[]}';
    let replaceWithApi = curTag.getAttribute('replaceWithApi');
    let updateWithData = curTag.getAttribute('updateWithData') || 'false';
    let autopull = curTag.getAttribute('autopull') || 'false';
    gcontext = {id, name, data, updateWithData, replaceWithApi, autopull};
    if (fnname === 'NA') continue;
    let fn2execute = new Function(fnname);
    fn2execute.apply(this, gcontext || []);//see html for static params and gcontext is for dynamic params binding
    // window[fnnamex[0]].apply(params,data);
    // eval(fnname);
}


//
// //everything is an object is js, eg class is also an object
// class X {
//     method1(){
//         console.log("1");
//     }
//     method2(){
//         this['method1']();
//         console.log("2");
//     }
// }
// let x  = new X();
// x['method2']();
