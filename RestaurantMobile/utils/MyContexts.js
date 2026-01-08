import { createContext, useReducer } from "react";

export const MyUserContext = createContext();

export const myUserReducer = (state, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
        default:
            return state;
    }
};
