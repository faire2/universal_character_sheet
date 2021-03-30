import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunk from "redux-thunk";
import user from "./userSlice";
import sheets from "./sheetsSlice"

export const store = configureStore({
   reducer: {
      user: user,
      sheets: sheets,
   },
   middleware: [thunk]
}, );

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();