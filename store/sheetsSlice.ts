import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loadData, saveData} from "../common/functions/asyncStorage";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {RootState} from "./index";
import {Firestore, ISheet} from "../components/sheet/sheetTypes";
import {LoadingStates} from "../common/types/generalTypes";
import {collections} from "../common/constants/collections";

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

interface ISheetFullParams {
    db: Firestore,
    sheets: ISheet[],
    uid: string,
    sheetId?: string
}

interface ISheetDbParams {
    db: Firestore,
    uid: string,
}

// add a new sheet
export const addSheet = createAsyncThunk(
    "sheets/newSheet", async ({db, uid, sheets}: ISheetFullParams) => {
        const timesStamp = Date.now();
        const newSheet: ISheet = {
            sheetName: "New sheet",
            timeStamp: timesStamp,
            fieldsArray: [],
            id: null,
        };
        sheets.push(newSheet);

        await db.collection(collections.USERS).doc(uid).collection(collections.SHEETS).add(newSheet);
        await saveData(asyncStorageKeys.SHEETS, sheets);
        return sheets;
    }
);

// remove a sheet and update storage and db
export const removeSheet = createAsyncThunk(
    "sheets/removeSheet", async ({sheets, sheetId, db, uid}: ISheetFullParams) => {
        // remove locally
        const sheetToBeRemovedIndex = sheets.findIndex(sheet => sheet.id === sheetId);
        sheets.splice(sheetToBeRemovedIndex, 1);
        await saveData(asyncStorageKeys.SHEETS, sheets)
            .catch(e => {
                console.info("Unable to remove sheet locally: ");
                console.error(e);
            });

        // remove in db
        await db.collection(collections.USERS).doc(uid).collection(collections.SHEETS).doc(sheetId).delete()
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
export const fetchSheetsFromDb = createAsyncThunk(
    "sheets/fetchSheetsFromDb", async ({uid, db}: ISheetDbParams) => {
        const sheetsRef = db.collection(collections.USERS).doc(uid).collection(collections.SHEETS);
        const sheets: Array<ISheet> = [];
        await sheetsRef.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // if the sheet is fresh, it does not have ID property filled in
                    const sheet: ISheet = doc.data() as ISheet;
                    if (!sheet.id && doc.id) {
                        sheet.id = doc.id;
                    } else {
                        console.info(doc);
                        throw new Error("Could not determine id for a sheet downloaded from db:");
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
export const {newSheetAdded, sheetRemoved, fetchSheets} = sheetsSlice.actions;

// EXPORTED SELECTORS
export const selectAllSheets = (state: RootState) => state.sheets.sheets;
// export const selectSheetById = (state: RootState, sheetId: string | null) => state.sheets.find((sheet: ISheet) => sheet.id === sheetId);
