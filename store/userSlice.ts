import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../common/types/generalTypes";
import {RootState} from "./index";

interface IUserState {
    userData: IUser
}

export const initialUser: IUserState = {
    userData: {
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: "",
        providerId: "",
        uid: "",
    }
};

export const userSlice = createSlice({
    name: "userData",
    initialState: initialUser,
    reducers: {
        signedIn: (state: IUserState, action: PayloadAction<IUser>) => {
            state.userData = action.payload;
        },
    }
});

export const {signedIn} = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.userData;