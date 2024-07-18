export const SET_CURRENT_CHAT_USER = "SET_CURRENT_CHAT";

export default function currentChatAction(user: any) {
    return {
        type: SET_CURRENT_CHAT_USER,
        payload: user
    }
}