export const sortByField=(data,fldname)=>{
    return data.sort((r1,r2)=>r1[fldname] - r2[fldname])
}

export const modal = function (selectorById) {
    let thisModal = document.getElementById(selectorById);
    let modalClose = document.getElementById(selectorById + "-close");
    let modalWrapper = document.getElementById(selectorById + "-wrapper");

    return {
        init: function () {
            this.onopen();
            this.onclose();
            return thisModal;
        },

        onopen: function () {
            thisModal.onclick = function (e) {
                e.preventDefault();
                modalWrapper.classList.add("modal-opened");
            };
        },

        onclose: function () {
            modalClose.onclick = function (e) {
                e.preventDefault();
                modalWrapper.classList.remove("modal-opened");
            };
        },
    };
}