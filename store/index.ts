import {AnyAction, configureStore, Dispatch, getDefaultMiddleware, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import user from "./userSlice";
import sheets from "./sheetsSlice"


function loggerMiddleWare(/*store: MiddlewareAPI*/) {
   return function(next: Dispatch) {
      return function(action: AnyAction) {
         console.log("Redux action: " + action.type);
         action.payload && console.log(action.payload);
         next(action);
      }
   }
}

export const store = configureStore({
   reducer: {
      user: user,
      sheets: sheets,
   },
   middleware: [...getDefaultMiddleware(), loggerMiddleWare]
}, );

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
    >
export const useAppDispatch = () => useDispatch<AppDispatch>();
