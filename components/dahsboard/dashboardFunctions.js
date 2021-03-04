import {collections} from "../../common/constants/collections";
import {saveData} from "../../common/functions/asyncStorageFunctions";
import {asyncStorageKeys} from "../../common/constants/asyncStorageKeys";

export async function loadStoreSheetNames(db, uid) {
    const sheetsRef = db.collection(collections.USERS).doc(uid).collection(collections.SHEETS);
    const sheetsNames = [];
    await sheetsRef.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                sheetsNames.push({
                    name: doc.data().sheetName,
                    id: doc.id,
                });
            })
        })
        .catch(e => {
            console.info("Unable to fetch sheet names:");
            console.error(e);
        });
    return sheetsNames;
}

export function updateSheetsIncludingDb(sheetNames, sheetId, setSheetNames, db, uid) {
    // update componenty
    setSheetNames(sheetNames);
    // update storage
    saveData(asyncStorageKeys.SHEETS_NAMES, sheetNames).catch(e => {
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

export function updateSheetsLocally(sheetNames, setSheetsNames) {
    setSheetsNames(sheetNames);
    saveData(asyncStorageKeys.SHEETS_NAMES, sheetNames).catch(e => {
        console.info("Unable to save sheet names locally: ");
        console.error(e);
    });
}