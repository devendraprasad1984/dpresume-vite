let errMsg = 'plz check logs and contact admin';

appGlobal.uploadHandler = function (typeOfUpload, type) {
    let formdata = new FormData(); //goes into servers $_FILES Object
    let files = $('#' + typeOfUpload)[0].files;
    let tags = $('#tag' + typeOfUpload).val(); //goes into Servers $_POST object
    if (files.length > 0) {
        formdata.append('upload', 1);
        formdata.append('file', files[0]);
        formdata.append('tags', tags);
        formdata.append('token', dpMod.initParam.sessionid);

        $.ajax({
            url: config.posting
            , type: 'POST'
            , contentType: false
            , processData: false
            , data: formdata,
            dataType: 'JSON'
            , success: (res) => {
                $('#' + typeOfUpload).val(null);
                $('#tag' + typeOfUpload).val(null);
                appGlobal.fetchUploads(type);
                if (typeof res === 'object')
                    swal(res.status);
                else
                    swal(res);
            }
            , error: (err) => {
                $('#' + typeOfUpload).val(null);
                $('#tag' + typeOfUpload).val(null);
                swal(JSON.stringify(errMsg));
            }
        });
    } else {
        swal('please choose to upload');
    }
}

appGlobal.fetchUploads = function (type, selectOnly, callback) {
    var action = "fetch";
    let url=(type === 'image' ? config.ImageData : config.VideoData);
    getData(url,(res)=>{
        appGlobal.linksCallback = callback;
        appGlobal.displayUploadedContents(type, res, (selectOnly || false));
    },error);
}
CRUD.handleUploadIconClick = (curElem) => {
    let type = $(curElem).attr('type');
    let uri = $(curElem).attr('uri');
    if (appGlobal.linksCallback !== undefined) {
        appGlobal.linksCallback(uri);
        swal.close();
    }
}
CRUD.handleMediaDelete = (curElem) => {
    let id2del = $(curElem).attr('id');
    let data = {crudUpload: 1, delete:1, id: id2del};
    postData(config.posting, data,(res)=>{
        let divcardid=$('#divcardid'+id2del);
        divcardid.remove();
        success.alert(res);
    });
}

appGlobal.displayUploadedContents = function (type, data, selectOnly) {
    let uploadContentDiv = $('#idUploadContents');
    let rows = [];
    rows.push(`
    <div>
        <button  class="btn green" onclick="appGlobal.fetchUploads('image',${selectOnly})">Images</button>
        <button  class="btn black" onclick="appGlobal.fetchUploads('video',${selectOnly})">Videos</button>
    </div>
    `);
    rows.push(`<h1 class="purpletxt">${type === 'image' ? 'Image Contents' : 'Video Contents'} - ${data.length} records found</h1>`);
    rows.push(`<div><input  style="width: 90%" type="text" id="txtuploadContentSearch" placeholder="enter filename or keyword or media tags, enter to search"/></div>`);
    if (data.length === 0) {
        rows.push(`<h3 class="redtxt">No ${type.toUpperCase()} Records Found</h3>`);
    } else {
        rows.push(`<div class="flexbox">`)
        let xrows = data.map(x => `
            <div class="flexcard" id="divcardid${x.id}">
                ${type === 'image' ? `<img src="${x.loc}" class="media-uploads" title="${x.tags}" uri="${x.loc}" type="${type}" onclick="CRUD.handleUploadIconClick(this)"/>`
            : `<video class="media-uploads" controls title="${x.tags}"> <source src="${x.loc}" type="video/mp4"> </video>`}
                ${selectOnly ? `<a class="purpletxt" href="javascript:void(0)" uri="${x.loc}" type="${type}" onclick="CRUD.handleUploadIconClick(this)">Select</a>`
                : (x.tags === 'sample' ? '' : `<a class="redtxt" href="javascript:void(0)" id="${x.id}" onclick="CRUD.handleMediaDelete(this)">Delete</a>`)
                }
            </div>
            `);
        rows.push(...xrows);
        rows.push(`</div>`);
    }
    if (selectOnly) {
        let xdiv = document.createElement('div');
        xdiv.id = 'openCardId';
        xdiv.style.width = '100%';
        xdiv.style.height = '500px';
        xdiv.style.overflow = 'auto';
        xdiv.style.position = 'relative';
        xdiv.innerHTML = rows.join('');
        swal({
            content: xdiv,
            button: 'Close'
        }).then(flag => swalRemover(xdiv));
    } else {
        uploadContentDiv.html(rows.join(''));
    }
}
