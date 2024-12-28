import ENUMS from "../enums";

export const auth0Action = (data) => {
    return {
        type: ENUMS.AUTH0,
        payload: data
    }
}