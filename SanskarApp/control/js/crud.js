function pullBanner() {
    CRUD.updateAd = (id) => {
        let desc = $('#idDesc' + id).val();
        let about = $('#idAbout' + id).val();
        // console.log(id,desc,about);
        let data = {crudAds: 1, update: 1, id, desc, about};
        postData(config.posting, data);
    }
    CRUD.deleteAd = (id) => {
        let data = {crudAds: 1, delete: 1, id};
        postData(config.posting, data);
        let parentDiv = '#adsCardParent' + id;
        $(parentDiv).remove();
    }
    CRUD.resetBanner = () => {
        $('#about').val("");
        $('#seltype').val("Text")
        $('#desc').val("");
    }
    CRUD.saveBanner = () => {
        let type = $('#seltype').val();
        let about = $('#about').val();
        let desc = $('#desc').val();
        if (type === "" || about === "" || desc === "") {
            swal("please enter input");
            return;
        }
        let data = {crudAds: 1, save: 1, about, desc, type};
        postData(config.posting, data);
        CRUD.resetBanner();
    }
    getData(config.adsUrl, (data) => {
        let rows = [];
        rows = data.map(x => {
            return `<div id="adsCardParent${x.id}" class="xrow cardx">
                <span><input id="idAbout${x.id}" type="text" value="${x.about}"/></span>
                <span class="alignEvenRow">
                   <textarea id="idDesc${x.id}" rows="5">${x.description}</textarea>
                   ${x.type.toLowerCase() !== 'text' ? dpMod.selectMedia("idDesc" + x.id) : ''}
                   <div class="xrow-bar-bottom right">
                        <span class="btn green" onclick="CRUD.updateAd(${x.id});">Save</span>
                        <span class="btn red" onclick="CRUD.deleteAd(${x.id});">Delete</span>
                    </div>
                </span>
                   ${(x.type.toLowerCase() === 'image' ? '<img class="media" src="' + x.description + '" />' : '')}
                   ${(x.type.toLowerCase() === 'video' ? '<video class="media" controls> <source src="' + x.description + '" type="video/mp4"> </video>' : '')}
                </div>`;
        });
        rightContainer.html(rows.join(''));
    }, (err) => {
        console.error(err)
    });
}

let appCats = {};

function pullCategory() {
    let dummyid = 9999;
    let baseDummyId = 9999;
    // let curcats = {catid: -1, l1id: -1, l2id: -1, pageid: -1};
    appGlobal.rerenderCats = (type, parentid) => {
        //pull only specific type of cats savings data only for async refresh of that section
        getData(config.categoryUrl + '&what2pull=' + type, (data) => {
            if (type === 'catl1') {
                appGlobal.categoryData['catL1'] = data['catL1'];
                appGlobal.displayCatL1(parentid);
            }
            if (type === 'catl2') {
                appGlobal.categoryData['catL2'] = data['catL2'];
                appGlobal.displayCatL2(parentid);
            }
            if (type === 'catpages') {
                appGlobal.categoryData['pages'] = data['pages'];
                appGlobal.displayPages(parentid);
            }
        }, (err) => {
            console.error(err)
        });
    }
    CRUD.saveCats = (type, id, parentid) => {
        let uid = '#' + type + id
        let inputs = Array.from($(uid).children('input'));
        let textArea = Array.from($(uid).children('textarea'));
        let select = Array.from($(uid).children('select'));
        let body = {};
        body['crudCategory'] = 1;
        body['savetype'] = type;
        [...inputs, ...textArea, ...select].map(x => {
            let dbfield = x.getAttribute('dbfield');
            body[dbfield] = $(x).val();
        });
        if (parseInt(body['id']) < baseDummyId)
            body['update'] = 1
        else
            body['save'] = 1
        postData(config.posting, body, (res) => {
            if (['catl1', 'catl2', 'catpages'].indexOf(type) === -1) {
                success.alert(res);
            } else {
                appGlobal.rerenderCats(type, parentid);
                success.alert(res);
            }
        });
    }
    CRUD.delCats = (type, id2del, parentid) => {
        let body = {};
        body['crudCategory'] = 1;
        body['savetype'] = type;
        body['delete'] = 1
        body['curdelid'] = id2del
        // body['curcats'] = curcats
        // console.log(type, body);
        postData(config.posting, body, (res) => {
            if (['catl1', 'catl2', 'catpages'].indexOf(type) === -1) {
                success.alert(res);
            } else {
                appGlobal.rerenderCats(type, parentid);
                success.alert(res);
            }
        });
    }

    appGlobal.addCats = (addtype, parentid) => {
        let xdummyid = dummyid + 1
        let {categories, catL1, catL2, pages} = appGlobal.categoryData;
        if (addtype === 'cat') {
            categories.push({
                id: xdummyid,
                category: '',
                description: '',
                icons: '',
                backgroundColor: 'white',
                fontColor: 'black'
            })
            appGlobal.displayCategories();
        }
        if (addtype === 'catl1') {
            catL1.push({id: xdummyid, catid: parentid, description: ''})
            appGlobal.displayCatL1(parentid);
        }
        if (addtype === 'catl2') {
            catL2.push({id: xdummyid, catL1: parentid, description: ''})
            appGlobal.displayCatL2(parentid);
        }
        if (addtype === 'catpages') {
            pages.push({id: xdummyid, catL2: parentid, description: '', subhead: '', type: 'Text'})
            appGlobal.displayPages(parentid);
        }
        dummyid = xdummyid;
    }

    appGlobal.displayCategories = () => {
        let rows = [];
        let color = enums.names.colors[Math.floor(Math.random() * enums.names.colors.length)];
        let borderStyle = `style="border-top: 5px solid ${color}; padding: 10px;"`;
        rows = [];
        let {categories} = appGlobal.categoryData;
        let type = 'cat';
        rows.push(`<h2 style="margin-bottom: 10px;">Categories
            <button class="btn blue" onclick="appGlobal.addCats('${type}')">Create New Section</button> <button class="btn black" onclick="loadSameUrl()">Reset</button></div>
            </h2>`);
        rows.push(`<div class="standardHeightAppDiv" ${borderStyle}>`);
        categories.map((x, i) => {
            rows.push(`<div class="line" id="${type + x.id}">
                <input type="hidden" value="${x.id}" dbfield="id"/>
                <input type="text" value="${x.category}" dbfield="category" title="name of category icon"/>
                <input type="text" style="width:100px" value="${x.description}" dbfield="description" title="small category description"/>
                <input type="text" id="${type + 'input' + i}" style="width:150px" value="${x.icons}" dbfield="icons" title="icon image link"/>
                <input class="xcolpick" type="text" style="width:50px;" value="${x.backgroundColor}" dbfield="backgroundColor" title="category page background color"/>
                <input class="xcolpick" type="text" style="width:50px;" value="${x.fontColor}" dbfield="fontColor" title="category page font text color"/>
                ${dpMod.selectMedia(type + 'input' + i)}
                <div class="right">
                    <img class="icon" src="${x.icons}" onclick="
                        appGlobal.selCat='${x.category}';
                        $('#idCatDetails').html('');
                        $('#idCatL1').html('');
                        $('#idCatL2').html('');
                        $('#idCatPages').html('');
                        appGlobal.displayCatDetails(${x.id});
                        appGlobal.displayCatL1(${x.id});
                        "/>
                    <a href="javascript:void(0)" class="" onclick="CRUD.saveCats('${type}',${x.id})"><i class="fa fa-save greentxt"></i></a>
                    <a href="javascript:void(0)" class="" onclick="CRUD.delCats('${type}',${x.id})"><i class="fa fa-trash redtxt"></i></a>
                </div>
            </div>
            `);
        });
        rows.push(`</div>`);
        rows.push(`<div class="alignEvenRow">`);
        rows.push(`<div id="idCatDetails" class="half"></div>`);
        rows.push(`<div id="idCatL1" class="half"></div>`);
        rows.push(`</div>`);
        rows.push(`<div class="alignEvenRow">`);
        rows.push(`<div id="idCatL2" class="half"></div>`);
        rows.push(`<div id="idCatPages" class="half"></div>`);
        rows.push(`</div>`);
        rightContainer.html(rows.join(''));
        colorPicker();
    }
    appGlobal.displayCatDetails = (id) => {
        let color = enums.names.colors[Math.floor(Math.random() * enums.names.colors.length)];
        let borderStyle = `style="border-top: 5px solid ${color}; padding: 10px;"`;
        rows = [];
        let {details} = appGlobal.categoryData;
        let xfilter = details.filter(x => parseInt(x.catid) === id);
        let type = 'catdet';
        rows.push(`<h2>Category Details</h2>`);
        rows.push(`<div class="" ${borderStyle}>`);
        rows.push(`<span class="grcolor1">For: ${appGlobal.selCat}</span>`);
        xfilter.map(x => {
            rows.push(`<div class="line" id="${type + x.id}">
                <input type="hidden" value="${x.id}" dbfield="id" />
                <input type="hidden" value="${x.catid}" dbfield="catid" />
                <textarea style="width:70%" rows="5"  dbfield="detail_description">${x.detail_description}</textarea>
                <a href="javascript:void(0)" class="right" onclick="CRUD.saveCats('${type}',${x.id})"><i class="fa fa-save greentxt"></i></a>
            </div>
            `);
        });
        rows.push(`</div>`);
        $('#idCatDetails').html(rows.join(''));
    }
    appGlobal.displayCatL1 = (id) => {
        let color = enums.names.colors[Math.floor(Math.random() * enums.names.colors.length)];
        let borderStyle = `style="border-top: 5px solid ${color}; padding: 10px;"`;
        rows = [];
        let {catL1} = appGlobal.categoryData;
        let xfilter = catL1.filter(x => parseInt(x.catid) === id);
        let type = 'catl1';
        rows.push(`<h2>Category Level 1 <button class="btn blue" onclick="appGlobal.addCats('${type}',${id})">Add</button></h2>`);
        rows.push(`<div class="standardHeightAppDiv" ${borderStyle}>`);
        rows.push(`<span class="grcolor1">For: ${appGlobal.selCat}</span>`);
        xfilter.map(x => {
            rows.push(`<div class="line" id="${type + x.id}">
                <input type="hidden" value="${x.id}" dbfield="id" />
                <input type="hidden" value="${x.catid}" dbfield="catid" />
                <input style="width:60%" value="${x.description}" dbfield="description"/>
                <div class="right">
                <a href="javascript:void(0)" class="purpletxt" onclick="
                        appGlobal.selCatL1='${x.catid} - ${x.description}';
                        $('#idCatL2').html('');
                        $('#idCatPages').html('');
                        appGlobal.displayCatL2(${x.id})"><i class="fa fa-arrow-circle-down"></i></a>
                <a href="javascript:void(0)" onclick="CRUD.saveCats('${type}',${x.id},${id})"><i class="fa fa-save greentxt"></i></a>
                <a href="javascript:void(0)" onclick="CRUD.delCats('${type}',${x.id},${id})"><i class="fa fa-trash redtxt"></i></a>
                </div>
            </div>
            `);
        });
        rows.push(`</div>`);
        $('#idCatL1').html(rows.join(''));
    }
    appGlobal.displayCatL2 = (id) => {
        let color = enums.names.colors[Math.floor(Math.random() * enums.names.colors.length)];
        let borderStyle = `style="border-top: 5px solid ${color}; padding: 10px;"`;
        rows = [];
        let {catL2} = appGlobal.categoryData;
        let xfilter = catL2.filter(x => parseInt(x.catL1) === id);
        let type = 'catl2';
        rows.push(`<h2>Category Level 2 <button class="btn blue" onclick="appGlobal.addCats('${type}',${id})">Add</button></h2>`);
        rows.push(`<div class="standardHeightAppDiv" ${borderStyle}>`);
        rows.push(`<span class="grcolor2">For: ${appGlobal.selCatL1}</span>`);
        xfilter.map(x => {
            rows.push(`<div class="line" id="${type + x.id}">
                <input type="hidden" value="${x.id}" dbfield="id" />
                <input type="hidden" value="${x.catL1}" dbfield="catL1" />
                <input style="width:60%" value="${x.description}" dbfield="description"/>
                <div class="right">
                <a href="javascript:void(0)" class="" onclick="
                        appGlobal.selCatL2='${x.catL1} - ${x.description}';
                        $('#idCatPages').html('');
                        appGlobal.displayPages(${x.id})"><i class="fa fa-arrow-circle-o-right purpletxt"></i></a>
                <a href="javascript:void(0)" onclick="CRUD.saveCats('${type}',${x.id},${id})"><i class="fa fa-save greentxt"></i></a>
                <a href="javascript:void(0)" onclick="CRUD.delCats('${type}',${x.id},${id})"><i class="fa fa-trash-o redtxt"></i></a>
               </div>
            </div>
            `);
        });
        rows.push(`</div>`);
        $('#idCatL2').html(rows.join(''));
    }
    appGlobal.displayPages = (id) => {
        let color = enums.names.colors[Math.floor(Math.random() * enums.names.colors.length)];
        let borderStyle = `style="border-top: 5px solid ${color}; padding: 10px;"`;
        rows = [];
        let {pages} = appGlobal.categoryData;
        let xfilter = pages.filter(x => parseInt(x.catL2) === id);
        let type = 'catpages';
        rows.push(`<h2>Category Pages <button class="btn blue" onclick="appGlobal.addCats('${type}',${id})">Add</button></h2>`);
        rows.push(`<div class="standardHeightAppDiv" ${borderStyle}>`);
        rows.push(`<span class="grcolor3">For: ${appGlobal.selCatL2}</span>`);
        xfilter.map((x, i) => {
            rows.push(`<div class="line" id="${type + x.id}">
                <input type="hidden" value="${x.id}" dbfield="id" />
                <input type="hidden" value="${x.catL2}" dbfield="catL2" />
                <input value="${x.subhead}" dbfield="subhead"/>
                <select dbfield="type">
                    <option value="Text" ${x.type.toLowerCase() === 'text' ? 'selected' : ''}>Text</option>
                    <option value="Image" ${x.type.toLowerCase() === 'image' ? 'selected' : ''}>Image</option>
                    <option value="Video" ${x.type.toLowerCase() === 'video' ? 'selected' : ''}>Video</option>
                    </select>
                <span class="right">
                <a href="javascript:void(0)" onclick="CRUD.saveCats('${type}',${x.id},${id})"><i class="fa fa-save greentxt"></i></a>
                <a href="javascript:void(0)" onclick="CRUD.delCats('${type}',${x.id},${id})"><i class="fa fa-trash-o redtxt"></i></a>
                </span>
                <textarea id="${type + 'textarea' + i}" rows="3" style="width:400px" dbfield="description">${x.description}</textarea>
                ${dpMod.selectMedia(type + 'textarea' + i)}
                ${(x.type.toLowerCase() === 'image' ? '<img class="media" src="' + x.description + '" />' : '')}
                ${(x.type.toLowerCase() === 'video' ? '<video class="media" controls> <source src="' + x.description + '" type="video/mp4"> </video>' : '')}
            </div>
            `);
        });
        rows.push(`</div>`);
        $('#idCatPages').html(rows.join(''));
    }
    getData(config.categoryUrl + '&what2pull=', (data) => {
        appGlobal.categoryData = data;
        appGlobal.displayCategories();
    }, (err) => {
        console.error(err)
    });
}

appGlobal.toggleConfig = (cur, id) => {
    $('.configs').hide();
    $('.configBtns').removeClass('activeBtns');
    let elm = $('#' + id);
    let curElm = $('#' + cur.id);
    curElm.addClass('activeBtns');
    elm.show();
}

CRUD.saveConfig = (cur) => {
    let key = cur.getAttribute('key');
    let value = $('#configValue' + key).val();
    let data = {crudConfig: 1, update: 1, key, value};
    postData(config.posting, data);
}

function pullConfig() {
    getData(config.configUrl, (data) => {
        let rows = [];
        rows.push(`<div id="buttonsConfig">`);
        let xrows = data.map((x, i) => {
            return `<span id="configBtn${x.key}" class='configBtns btn purple ${i !== 0 ? '' : 'activeBtns'}' style="margin: 2px;"
            onclick="appGlobal.toggleConfig(this,'configKey${x.key}');">${x.key}</span>`
        });
        rows.push(...xrows);
        rows.push(`</div>`);
        xrows = data.map((x, i) => {
            let isImage = x.value.indexOf('.gif') !== -1 || x.value.indexOf('.jpeg') !== -1 || x.value.indexOf('.png') !== -1 ? true : false;
            let isVideo = x.value.indexOf('mp4') !== -1 ? true : false;
            return `<div id="configKey${x.key}" class="configs input-inline xrow ${i !== 0 ? 'hide' : 'show'}">
                    <span class="redtxt">${x.helperText}</span>
                    <button class="btn green right" key="${x.key}" onclick="CRUD.saveConfig(this)">Save</button>
                    <span>
                        <textarea id="configValue${x.key}" rows="5" class="${x.key==='app-color'?'xcolpick':''}">${x.value}</textarea>
                        ${isImage ? dpMod.selectMedia('configValue' + x.key) : ''}
                        ${(isImage ? '<img class="media" src="' + x.value + '" />' : '')}
                        ${(isVideo ? '<video class="media" controls> <source src="' + x.value + '" type="video/mp4" /></video>' : '')}
                    </span>
                </div>
            `;
        });
        rows.push(...xrows);
        // console.log(rows,xrows,...xrows);
        rightContainer.html(rows.join(''));
        colorPicker();
    }, (err) => {
        console.error(err)
    });
}

function pullErrors() {
    let styles = {
        cell1: 'width: 5%'
        , cell2: 'width: 10%'
        , cell3: 'width: 60%'
        , cell4: 'width: 20%'
        , gridTemplate: "grid-template-columns: repeat(4, 1fr)"
    }
    getData(config.errorsUrl, (data) => {
        let rows = [];
        rows.push(`
                <div><div class="table-header">
                <span style="${styles.cell1}"></span>
                <span style="${styles.cell2}">Message</span>
                <span style="${styles.cell3}">Trace</span>
                <span style="${styles.cell4}">When?</span>
                </div></div>
            `);
        data.map(x => {
            rows.push(`
                <div><div class="table">
                <span style="${styles.cell1}">${x.log_id}</span>
                <span style="${styles.cell2}">${x.error_message}</span>
                <span style="${styles.cell3}">${x.error_trace}</span>
                <span style="${styles.cell4}">${x.error_log_date}</span>
                </div></div>
            `);
        });
        rightContainer.html(rows.join(''));
    }, (err) => {
        console.error(err)
    });
}

CRUD.sendEmail=(cur,mailObj,callback)=>{
    let oldTxt='';
    let isCurUndefined= (typeof cur === "undefined");
    if(!isCurUndefined){
        oldTxt=cur.innerText;
        cur.innerText=plzwait;
    }
    postData(config.posting, mailObj, (r)=> {
        if(!isCurUndefined) cur.innerText=oldTxt;
        callback(r.status);
    });
}

function pullSupport() {
    CRUD.queryObject = {};
    CRUD.replyClick = (qid) => {
        let curQueryObj = CRUD.queryObject[qid];
        let {id, email, query} = curQueryObj;
        CRUD.submitSupportResponse = (cur) => {
            let oldTxt=cur.innerText;
            cur.innerText=plzwait;
            let queryResponse = $('#txtQueryResponse' + $(cur).attr('id')).val();
            curQueryObj['queryResponse'] = queryResponse.substr(0,990);
            curQueryObj['crudQuery'] = 1;
            // console.log('query submit response', curQueryObj);
            postData(config.posting, curQueryObj, (r)=> {
                let mailbody=queryResponse;
                let sendObj={sendmail,email,mailbody,query};
                CRUD.sendEmail(undefined,sendObj,(p)=> {
                    cur.innerText=oldTxt;
                    alert('mail - ' + p);
                    swal.close();
                });
            });
        } //this function is acting like a closure as curOueryObj can be used inside it as well
        CRUD.handleResendMail=(cur)=>{
            let mailbody=$(cur).attr('response');
            let sendObj={sendmail,email,mailbody,query};
            CRUD.sendEmail(cur,sendObj,(p)=> {
                alert('resend mail - ' + p);
            });
            // console.log('mailer',cur);
        }
        let fnSupportReplyCallback = (replies) => {
            // console.log('replies', replies);
            let rows = [];
            let xrow = [];
            let xdiv = document.createElement('div');
            xdiv.id = 'queryId';
            xdiv.style.width = '100%';
            xdiv.style.height = '500px';
            xdiv.style.overflow = 'auto';
            xdiv.style.position = 'relative';
            xrow.push(`
            <div class="alignEvenColumn">
                <span><h2 class="purpletxt">QUERY RESPONSE: ${id} - ${email}</h2></span>
                <span><textarea id="txtQueryResponse${id}" rows="5" style="width: 80%" placeholder="enter your response here (1000 chars)"></textarea></span>
                <span>
                    <button class="btn purple" id="${id}" email="${email}" onclick="CRUD.submitSupportResponse(this)">Submit</button>
                </span>
            </div>
            `);
            rows.push(...xrow);
            xrow=(replies.map(x=>{
                return `<div class="alignEvenRow left line">
                    <span style="width: 80%;" type="reply" class="">${x.reply}</span>
                    <span style="width: 15%;" type="repliedon" class="graytxt">${x.repliedOn}</span>
                    <span style="width: 5%;" class="purpletxt right" email="${email}" query="${query}" response="${x.reply}" onclick="CRUD.handleResendMail(this);">Mail</span>
                </div>`
            }));
            rows.push(...xrow);
            xdiv.innerHTML = rows.join('');
            swal({
                content: xdiv,
                button: 'Close'
            }).then(flag => swalRemover(xdiv));
        }
        getData(config.repliesUrl + '&id=' + id, (replies) => {
            fnSupportReplyCallback(replies);
        });
    }

    let styles = {
        cell2: 'width: 10%'
        , cell3: 'width: 10%'
        , cell4: 'width: 15%'
        , cell5: 'width: 55%'
        , cell6: 'width: 10%'
        , gridTemplate: "grid-template-columns: repeat(6, 1fr)"
    }
    getData(config.supportUrl, (data) => {
        let rows = [];
        rows.push(`<div>
              <span><input style="width: 90%;" type="text" placeholder="search queries by name,mobile,email,querytext - top 200 shown"/></span>
            </div>`);
        rows.push(`
                <div><div class="table-header">
                <span style="${styles.cell2}">Name</span>
                <span style="${styles.cell3}">Mobile</span>
                <span style="${styles.cell4}">Email</span>
                <span style="${styles.cell5}">Query</span>
                <span style="${styles.cell6}"></span>
                </div></div>
            `);
        let xrows = data.map((x) => {
                CRUD.queryObject[x.id] = x;
                return `<div class="table line ${x.isreplied==='1'?'table-cells-gray':''}">
                    <span style="${styles.cell2}">${x.name}</span>
                    <span style="${styles.cell3}">${x.mobile}</span>
                    <span style="${styles.cell4}">${x.email}</span>
                    <span style="${styles.cell5}">${x.query}</span>
                    <span style="${styles.cell6}">
                    <a class="purpletxt" onclick="CRUD.replyClick(${x.id})">reply</a>
                </span>
                </div>`
            }
        );
        rows.push(...xrows);
        rightContainer.html(rows.join(''));
    }, (err) => {
        console.error(err)
    });
}

// function pullEvents() {
//     appGlobal.pullRegisteredEventsInfo = (id) => {
//         let event = appGlobal.eventsData.filter(x => parseInt(x.event_id) === id)[0];
//         let eventInfoDiv = $('#idRegisteredUsers');
//         let uri = config.regEventsInfoUrl + '&id=' + id
//         getData(uri, (data) => {
//             let result = data.map(x => {
//                 return `<div class="xrow">
//                     <div><b>${x.name} - ${x.email} - ${x.mobile}</b></div>
//                     <div>${x.info}</div>
//                </div>`;
//             });
//             result.splice(0, 0, `<h3>found ${data.length} record(s)...</h3>`)
//             result.splice(0, 0, `<h1>Details of Registrants, for <span class="grcolor3">${event.title}</span>, event ID: ${id}</h1>`)
//             eventInfoDiv.html(result.join(''));
//         })
//     }
//     appGlobal.fillEventFormEdit = (id) => {
//         let event = appGlobal.eventsData.filter(x => parseInt(x.event_id) === id)[0];
//         // console.log('inside current event', event_id, event);
//         // let eventDate = new Date(event.event_date);
//         $('#id').val(id);
//         $('#date').val(event.event_date);
//         $('#eventname').val(event.title);
//         $('#eventdesc').val(event.description);
//     }
//     CRUD.deleteEvent = (id) => {
//         let data = {crudEvents: 1, delete: 1, id};
//         postData(config.saveData, data);
//         let parentDiv = '#eventLine' + id;
//         $(parentDiv).remove();
//     }
//     CRUD.resetEvent = () => {
//         $('#id').val("");
//         $('#date').val("");
//         $('#eventname').val("");
//         $('#eventdesc').val("");
//     }
//     CRUD.saveEvent = () => {
//         let id = $('#id').val();
//         let date = $('#date').val();
//         let title = $('#eventname').val();
//         let desc = $('#eventdesc').val();
//         if (date === "" || title === "" || desc === "") {
//             swal("please enter input");
//             return;
//         }
//         let data = (id === "" ? {crudEvents: 1, save: 1, desc, date, title} : {
//             crudEvents: 1,
//             update: 1,
//             id,
//             desc,
//             date,
//             title
//         });
//         postData(config.saveData, data);
//         CRUD.resetEvent();
//     }
//     appGlobal.handleLineClick = (id) => {
//         appGlobal.fillEventFormEdit(id);
//         appGlobal.pullRegisteredEventsInfo(id);
//     }
//     getData(config.eventsUrl, (data) => {
//         appGlobal.eventsData = data;
//         let rows = [];
//         rows.push(`
//                 <div class="lineheader">
//                 <span>ID</span>
//                 <span>When</span>
//                 <span>Title</span>
//                 <span>Description</span>
//                 </div>
//             `);
//         data.map(x => {
//             rows.push(`
//                 <div id="eventLine${x.event_id}" class="line" onclick="appGlobal.handleLineClick(${x.event_id})">
//                 <span>${x.event_id}</span>
//                 <span>${x.event_date}</span>
//                 <span>${x.title}</span>
//                 <span style="width: auto">${x.description}</span>
//                 <span class="right">
//                     <a href="javascript:void(0)" class="red textwhite" onclick="CRUD.deleteEvent(${x.event_id})">Delete</a>
//                 </span>
//                 </div>
//             `);
//         });
//         rightContainer.html(rows.join(''));
//     }, (err) => {
//         console.error(err)
//     });
// }

function pullSettings() {
    CRUD.saveSettings=(cur)=>{
        let name=$(cur).attr('name');
        let pwd=$('#pwd').val();
        let repwd=$('#repwd').val();
        let email=$('#email').val();
        if(pwd.length<8 && pwd!==''){
            swal('min 8 characters password is needed');
            return;
        }
        if(pwd!==repwd){
            swal('passwords dont match');
            return;
        }
        postData(config.posting,{crudSetting:1,name,pwd,email});
    }
    let name=dpMod.initParam.name;
    postData(config.posting,{userSetting:1,name},(res)=>{
        let {email}=res[0];
        let rows=[];
        rows.push(`
        <div class="alignEvenColumn">
            <span><input id="pwd" type="password" placeholder="enter new password"/></span>
            <span><input id="repwd" type="password" placeholder="confirm new password"/></span>
            <span><input id="email" type="text" value="${email}" placeholder="update email"/></span>
            <span><button class="btn green" name="${name}" onclick="CRUD.saveSettings(this)">Save</button></span>
        </div>
    `);
        rightContainer.html(rows.join(''));
    });
}


function pullUploads() {
    appGlobal.fetchUploads('image');
}

function pullData(tag) {
    rightContainer = $('#right2');
    if(dpMod.initParam===undefined) setProfileAvtars();
    if (tag !== enums.names.home) rightContainer.html("");
    if (tag === enums.names.banner) pullBanner();
    else if (tag === enums.names.category) pullCategory();
    else if (tag === enums.names.config) pullConfig();
    else if (tag === enums.names.errors) pullErrors();
    // if (tag === enums.names.events) pullEvents();
    else if (tag === enums.names.support) pullSupport();
    else if (tag === enums.names.uploads) pullUploads();
    else if (tag === enums.names.settings) pullSettings();
}

function handleLeftNavBar() {
    let menu = $('#leftMenu');
    let rightBox = $('#rightContainer');
    isvisible = menu.is(":visible");
    if (isvisible) {
        menu.hide();
        rightBox.removeClass('rightbox');
    } else {
        menu.show();
        rightBox.addClass('rightbox');
    }
}
