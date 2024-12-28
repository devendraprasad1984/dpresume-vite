(function () {
    dpMod.what2RunOnInit=()=>{
        window.addEventListener('load', dpMod.router());
        overlayContainer.hide();
    }
    let localObj=localStorage.getItem(localObjName);
    dpMod.initParam=JSON.parse(localObj);
    // console.log('localObj',dpMod.initParam);
    if(dpMod.initParam===undefined || dpMod.initParam==='' || dpMod.initParam===null)
        setProfileAvtars();
    else
        dpMod.what2RunOnInit();
})();
