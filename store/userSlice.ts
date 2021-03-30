import {createSlice} from "@reduxjs/toolkit";
import {IUser} from "../common/types/generalTypes";

export const initialUser: IUser = {
    displayName: "",
    email: "",
    phoneNumber: "",
    photoURL: "",
    providerId: "",
    uid: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialUser,
    reducers: {
        signedIn: (state, action) => {
            const user: IUser = action.payload;
            state.uid = user.uid;
        },
    }
});

export const {signedIn} = userSlice.actions;
export default userSlice.reducer;