import {atom} from 'recoil'
import EnumObject from "../../config/enum";

const currentSlideNumber=atom({
    key: EnumObject.currentSlideNumber,
    default: 1
})

export default currentSlideNumber