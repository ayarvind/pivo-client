import { User } from "../interface/User";
import userReducer from "./reducers/userAction";
import { configureStore, Reducer } from "@reduxjs/toolkit";
const store = configureStore({
    reducer: {
        user: userReducer as Reducer<User, any>
    }
})

export default store;
