import actionTypes from "../actions/actionTypes";

const initState = {
    active: "",
    content: ""
}


const stateReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.STATE:
            return ({
                ...state,
                active: action?.data?.active,
                content: action?.data?.content
            })
        default:
            return state;
    }
}

export default stateReducer
