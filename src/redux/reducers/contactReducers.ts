import { SET_CONTACTS } from "../actions/contactAction";
const initialState = {
    contacts: []

}
function contactReducers(state = initialState, action:{
    type: string;
    payload: any;
}){
    console.log(action.payload, "action")
  switch (action.type) {
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    default:
      return state;
  }
}
export default contactReducers;