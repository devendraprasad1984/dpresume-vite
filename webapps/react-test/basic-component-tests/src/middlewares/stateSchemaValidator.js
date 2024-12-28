import stateSchema from "../schema/stateSchema";
import tv4 from 'tv4'


const stateSchemaValidator = ({dispatch, getState}) => (next) => (action) => {
    next(action)
    const valid = tv4.validate(getState(), stateSchema)
    if(!valid){
        console.warn('%c invalid state schema detected','background: yellow; color: mediumseagreen')
    }

}

export default stateSchemaValidator