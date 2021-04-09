import {collections} from "../../common/constants/collections";
import {Firestore, ISheet} from "../sheet/sheetTypes";
import {asyncStorageKeys} from "../../common/constants/asyncStorageKeys";
import {saveData} from "../../common/functions/asyncStorage";

export async function loadDbSheets(db: Firestore, uid: string) {
    const sheetsRef = db.collection(collections.USERS).doc(uid).collection(collections.SHEETS);
    const sheets: Array<ISheet> = [];
    await sheetsRef.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const sheet: ISheet = doc.data() as ISheet;
                if (doc.id) {
                    sheet.id = doc.id;
                } else {
                    console.info(doc);
                    throw new Error("Could not determine id for a sheet downloaded from db:");
                }
                sheets.push(sheet);
            })
        })
        .catch(e => {
            console.info("Unable to fetch sheet names:");
            console.error(e);
        });
    return sheets;
}

export function updateSheetsIncludingDb(sheets: Array<ISheet>, sheetId: string, setSheetNames: Function, db: Firestore,
                                        uid: string) {
    // update componenty
    setSheetNames(sheets);
    // update storage
    saveData(asyncStorageKeys.SHEETS, sheets).catch(e => {
        console.info("Unable to save sheet names locally: ");
        console.error(e);
    });
    // update db
    db.collection(collections.USERS).doc(uid).collection(collections.SHEETS).doc(sheetId).delete()
        .then(() => console.log("Sheet successfully removed: " + sheetId))
        .catch(e => {
            console.info("Unable to remove sheet in db: ");
            console.error(e);
        })
}

export function updateSheetsLocally(sheets: any, setSheets: Function) {
    setSheets(sheets);
    saveData(asyncStorageKeys.SHEETS, sheets).catch(e => {
        console.info("Unable to save sheet names locally: ");
        console.error(e);
    });
}