import React, {useEffect} from "react";
import '../../dropdown.css'

const DropDownGroupIcons = ({id, placeholder, children}) => {
    useEffect(() => {
        for (const dropdown of document.querySelectorAll(".select-wrapper")) {
            dropdown.addEventListener('click', function () {
                this.querySelector('.select').classList.toggle('open');
            })
        }
        window.addEventListener('click', function(e) {
            for (const select of document.querySelectorAll('.select')) {
                if (!select.contains(e.target)) {
                    select.classList.remove('open');
                }
            }
        });

    },[])
    return (
        <div className={"select-wrapper"}>
            <div className={"select"}>
                <div className="select__trigger"><span>{placeholder}</span>
                    <div className="arrow"></div>
                </div>
                <div className="custom-options">
                    {/*<span className="custom-option selected" data-value="tesla">Tesla</span>*/}
                    {children}
                </div>
            </div>
        </div>
    )
}
export default React.memo(DropDownGroupIcons)