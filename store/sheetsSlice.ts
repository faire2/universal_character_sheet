import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loadData} from "../common/functions/asyncStorage";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {RootState} from "./index";
import {ISheet} from "../components/sheet/sheetTypes";
import {LoadingStates} from "../common/types/generalTypes";

// INITIAL DEFINITIONS
interface SheetsState {
    sheets: ISheet[],
    loadingState: LoadingStates,
    errorMessage: string | null,
}

const initSheetsArray: ISheet[] =
    [{
        sheetName: "",
        timeStamp: Date.now(),
        fieldsArray: [],
        id: null,
    }];

const initialSheetsState: SheetsState = {
    sheets: initSheetsArray,
    loadingState: LoadingStates.IDLE,
    errorMessage: null,
};

// THUNKS
export const fetchSheetsLocally = createAsyncThunk(
    "sheets/fetchSheets", async () => {
        debugger;
        const sheets: ISheet[] = await loadData(asyncStorageKeys.SHEETS, true);
        return sheets;
    }
);

export function tryToFetch() {
    console.log("trying to fetch");
    return (dispatch) => {
        console.log("inside async");
        dispatch(fetchSheets(initialSheetsState))
    }
}

// SLICE
export const sheetsSlice = createSlice({
    name: "sheets",
    initialState: initialSheetsState,
    reducers: {
        newSheetAdded: (state, action) => {
            state.sheets.push(action.payload);
        },
        sheetRemoved: (state, action) => {
            const sheetToRemove: undefined | ISheet = state.sheets.find(sheet => sheet.id === action.payload);
            if (sheetToRemove) {
                state.sheets.splice(state.sheets.indexOf(sheetToRemove));
            } else {
                throw new Error("Unable to find sheet to remove " + action.payload);
            }
        },
        fetchSheets: (state, action) => {
            state.sheets = action.payload
        },
    },
});


export default sheetsSlice.reducer;

// EXPORTED ACTIONS
export const {newSheetAdded, sheetRemoved, fetchSheets} = sheetsSlice.actions;

// EXPORTED SELECTORS
export const selectAllSheets = (state: RootState) => state.sheets;
// export const selectSheetById = (state: RootState, sheetId: string | null) => state.sheets.find((sheet: ISheet) => sheet.id = sheetId);
