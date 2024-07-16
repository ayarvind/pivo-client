import { SET_USER } from "../actions/userAction";
const initialState = {
    phone:'',
    name:'',
    image:'',
    id:''

}

export default function userReducer(state = initialState, action: {
    type: string;
    payload: any;
}) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                phone: action.payload.phone,
                name: action.payload.name,
                image: action.payload.image,
                id: action.payload.id
            }
        default:
            return state
    }
}