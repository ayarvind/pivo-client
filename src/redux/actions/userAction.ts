import { User } from "../../interface/User";

export const SET_USER = 'SET_USER';

export default function setUser(user: User) {
    return {
        type: SET_USER,
        payload: user
    }
}