import { SET_CURRENT_CHAT_USER } from "../actions/currentChatAction";

const initialState = {
    currentChat: {},
    isKeyboardOpen: false
}
function currentChatReducer(state = initialState, action: {
    type: string,
    payload: any
}) {
    switch (action.type) {
        case SET_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChat: action.payload
            }
        default:
            return state;
    }
}

export default currentChatReducer;