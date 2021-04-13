import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {cloneDeep} from "lodash"
import {loadData, saveData} from "../common/functions/asyncStorage";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {RootState} from "./index";
import {ISheet} from "../components/sheet/sheetTypes";
import {LoadingStates} from "../common/types/generalTypes";
import {collections} from "../common/constants/collections";
import {dbForRedux} from "../firebase/context/DbContext";

// INITIAL DEFINITIONS
export interface ISheetsState {
    sheets: ISheet[],
    loadingStatus: LoadingStates,
    errorMessage: string | null,
}

const initSheetsArray: ISheet[] =
    [{
        sheetName: "",
        timeStamp: Date.now(),
        fieldsArray: [],
        id: null,
    }];

const initialSheetsState: ISheetsState = {
    sheets: initSheetsArray,
    loadingStatus: LoadingStates.IDLE,
    errorMessage: null,
};

// THUNKS

// add a new sheet
interface ISheetParam {sheet: ISheet}
export const addSheet = createAsyncThunk<ISheet[], ISheetParam, {state: RootState}>(
    "sheets/newSheet", async ({sheet}: ISheetParam, thunkAPI) => {
        sheet.timeStamp = Date.now();
        const sheets: ISheet[] = thunkAPI.getState().sheets.sheets;

        const uid = thunkAPI.getState().user.userData.uid;
        sheet.id = await dbForRedux.collection(collections.USERS).doc(uid).collection(collections.SHEETS).doc().id;
        await dbForRedux.collection(collections.USERS).doc(uid).collection(collections.SHEETS).add(sheet);
        await saveData(asyncStorageKeys.SHEETS, sheets);

        sheets.push(sheet);
        return sheets;
    }
);

// remove a sheet and update storage and db
interface IRemoveParams {sheetId: string}
export const removeSheet = createAsyncThunk<ISheet[], IRemoveParams, {state: RootState}>(
    "sheets/removeSheet", async ({sheetId}: IRemoveParams, thunkAPI) => {
        const sheets = cloneDeep(thunkAPI.getState().sheets.sheets);
        const uid = thunkAPI.getState().user.userData.uid;

        // remove locally
        const sheetToBeRemovedIndex = sheets.findIndex(sheet => sheet.id === sheetId);
        sheets.splice(sheetToBeRemovedIndex, 1);
        await saveData(asyncStorageKeys.SHEETS, sheets)
            .catch(e => {
                console.info("Unable to remove sheet locally: ");
                console.error(e);
            });

        // remove in db
        await dbForRedux.collection(collections.USERS).doc(uid).collection(collections.SHEETS).doc(sheetId).delete()
            .then(() => console.log("Sheet successfully removed: " + sheetId))
            .catch(e => {
                console.info("Unable to remove sheet in db: ");
                console.error(e);
            });
        return sheets;
    }
);

// load sheets from local storage
export const fetchSheetsLocally = createAsyncThunk(
    "sheets/fetchSheetsLocally", async () => {
        const sheets: ISheet[] = await loadData(asyncStorageKeys.SHEETS, true);
        return sheets;
    }
);

// load sheets from db and update local storage
export const fetchSheetsFromDb = createAsyncThunk<ISheet[], null, {state: RootState}>(
    "sheets/fetchSheetsFromDb", async (_, thunkAPI) => {
        const uid = thunkAPI.getState().user.userData.uid;
        const sheetsRef = dbForRedux.collection(collections.USERS).doc(uid).collection(collections.SHEETS);
        const sheets: Array<ISheet> = [];
        await sheetsRef.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // if the sheet is fresh, it does not have ID property filled in
                    const sheet: ISheet = doc.data() as ISheet;
                    if (!sheet.id) {
                        sheet.id = doc.id;
                    }
                    sheets.push(sheet);
                })
            })
            .catch(e => {
                console.info("Unable to fetch sheets:");
                console.error(e);
                return null;
            });
        await saveData(asyncStorageKeys.SHEETS, sheets)
            .catch(e => {
                console.info("Unable to save sheets locally: ");
                console.error(e);
            });
        return sheets;
    }
);

// SLICE
export const sheetsSlice = createSlice({
    name: "sheets",
    initialState: initialSheetsState,
    reducers: {
        sheetNameChanged: (state, action: PayloadAction<{sheetId: string, sheetName: string}>) => {
            const sheet = state.sheets.find((sheet: ISheet) => sheet.id === action.payload.sheetId);
            if (sheet) {
                sheet.sheetName = action.payload.sheetName;
            } else { console.info("Unable to change sheet to change its name: " + action.payload.sheetId) }
        },
    },
    extraReducers: builder => {
        // fetchSheetsLocally
        builder.addCase(fetchSheetsLocally.pending, (state) => {
            state.loadingStatus = LoadingStates.LOADING;
        });
        builder.addCase(fetchSheetsLocally.fulfilled, (state, action) => {
            if (state.loadingStatus === LoadingStates.IDLE) {
                state.loadingStatus = LoadingStates.SUCCEEDED;
                state.sheets = action.payload;
            } else {
                console.info("Sheets have already been loaded, will no try to fetch them locally.")
            }
        });

        // fetchSheetsFromDb
        builder.addCase(fetchSheetsFromDb.pending, state => {
            state.loadingStatus = LoadingStates.LOADING;
        });
        builder.addCase(fetchSheetsFromDb.fulfilled, (state, action) => {
            state.loadingStatus = LoadingStates.SUCCEEDED;
            state.sheets = action.payload;
        });

        // removeSheet
        builder.addCase(removeSheet.pending, state => {
            state.loadingStatus = LoadingStates.LOADING;
        });
        builder.addCase(removeSheet.fulfilled, (state, action) => {
            state.loadingStatus = LoadingStates.SUCCEEDED;
            state.sheets = action.payload;
        });

        // addSheet
        builder.addCase(addSheet.pending, state => {
            state.loadingStatus = LoadingStates.LOADING;
        });
        builder.addCase(addSheet.fulfilled, (state, action) => {
            state.loadingStatus = LoadingStates.SUCCEEDED;
            state.sheets = action.payload;
        })

        // todo implement error states handling

    }
});


export default sheetsSlice.reducer;

// EXPORTED ACTIONS
export const {sheetNameChanged} = sheetsSlice.actions;

// EXPORTED SELECTORS
export const selectAllSheets = (state: RootState) => state.sheets.sheets;
export const selectSheetByIndex = (state: RootState, index: number) => state.sheets.sheets[index];
export const selectSheetById = (state: RootState, sheetId: string) => state.sheets.sheets.find(sheet =>
    sheet.id === sheetId);
