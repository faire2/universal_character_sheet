import React, {useEffect, useState} from "react";
import {BasicView} from "../../styling/commonStyles";
import {NavigationLocations} from "../../common/constants/locations";
import {Button} from "react-native";
import {loadData, removeItem} from "../../common/functions/asyncStorageFunctions";
import {asyncStorageKeys} from "../../common/constants/asyncStorageKeys";
import {useAuth} from "../../common/context/AuthContext";
import {useDb} from "../../common/context/DbContext";
import {collections} from "../../common/constants/collections";
import {Sheets} from "./Sheets";
import {loadStoreSheetNames, updateSheetsIncludingDb, updateSheetsLocally} from "./dashboardFunctions";

export default function Dashboard(props) {
    const [sheetsNames, setSheetsNames] = useState([]);

    const {user} = useAuth();
    const {signOut} = useAuth();
    const {db} = useDb();

    // we try to fetch sheet names from local storage to make the first load faster
    useEffect(() => {
        async function fetchStoreSheetNames() {
            return await loadData(asyncStorageKeys.SHEETS_NAMES, true);
        }

        fetchStoreSheetNames()
            .then(res => res && setSheetsNames(res))
            .catch(e => {
                console.info("Unable to fetch local sheet names: ");
                console.error(e);
            });
    }, []);

    // we also try to fetch data from the db and replace local data if successful
    useEffect(() => {
        // we can only call the store if we already have the user object ready
        if (user.uid) {
            loadStoreSheetNames(db, user.uid)
                .then(sheetNames => {
                    updateSheetsLocally(sheetNames, setSheetsNames)
                })
                .catch(e => {
                    console.info("Unable to fetch local sheet names: ");
                    console.error(e);
                });
        }
    }, [user]);

    function removeSheet(i) {
        console.log("Removing sheet with i: " + i);
        if (window.confirm("Do you really want to get rid of this sheet? It shall be taken, but not returned...")) {
            const tSheetNames = [...sheetsNames];
            tSheetNames.splice(i, 1);
            updateSheetsIncludingDb(tSheetNames, sheetsNames[i].id, setSheetsNames, db, user.uid);
        }
    }

    async function logOut() {
        await removeItem(asyncStorageKeys.USER_LOGGED_IN);
        signOut().then(() => {
            console.log("User logged out.");
            props.navigation.navigate(NavigationLocations.LOGIN);
        })
    }

    function createNewSheet() {
        const sheetName = "New sheet";
        console.log("Creating a new sheet");
        db.collection(collections.USERS).doc(user.uid).collection(collections.SHEETS).add({
            sheetName: sheetName
        })
            .then(() => {
                console.log("New sheet added for user " + user.uid + " with name " + sheetName);
                loadStoreSheetNames(db, user.uid)
                    .then(sheetNames => {
                        updateSheetsLocally(sheetNames, setSheetsNames)
                    })
                    .catch(e => {
                        console.info("Unable to fetch local sheet names: ");
                        console.error(e);
                    });
            })
            .catch((e) => {
                console.warning("Received error while trying to add a new sheet for user" + user.uid + " with name " + sheetName);
                console.error(e);
            });
    }

    //todo implement
    /*function confirmSheetRemoval(i) {
        Alert.alert(
            "Do you really want to remove that sheet?",
            "It shall be taken, but never returned...",
            [
                {
                    text: "Nope",
                    onPress: () => console.log("Nope!"),
                    style: "cancel"
                },
                {text: "Sure!", onPress: () => removeSheet(i)}
            ],
            {cancelable: false}
        );
    }*/

    return (
        <BasicView>
            <Sheets sheetsNames={sheetsNames} removeSheet={removeSheet}/>
            <Button title="New sheet" onPress={() => createNewSheet()}/>
            <Button title="Logout" onPress={() => logOut()}/>
        </BasicView>
    );
}

