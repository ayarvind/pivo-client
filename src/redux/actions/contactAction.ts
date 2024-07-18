export const SET_CONTACTS = "SET_CONTACTS";
export default function contactAction(contact:any){
    return {
        type: SET_CONTACTS,
        payload: contact
    }
}