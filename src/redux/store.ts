import { User } from "../interface/User";
import contactReducers from "./reducers/contactReducers";
import currentChatReducer from "./reducers/currentChatReducers";
import userReducer from "./reducers/userReducers";
import { configureStore, Reducer } from "@reduxjs/toolkit";
const store = configureStore({
    reducer: {
        user: userReducer as unknown as Reducer<User, any>,
        contacts: contactReducers as unknown as Reducer<User, any>,
        currentChat: currentChatReducer as unknown as Reducer<User, any>
    }
})

export default store;
