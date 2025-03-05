import actionTypes from "./actionTypes";

export const state = (payload) => async (dispatch) => {
    dispatch({
        type:actionTypes.STATE,
        data:payload
    })
}


