import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {Button} from "react-native";

import {loadData, removeItem} from "../../common/functions/asyncStorage";
import {BasicView} from "../../common/styling/commonStyles";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/locations";
import {asyncStorageKeys} from "../../common/constants/asyncStorageKeys";
import {useAuth} from "../../firebase/context/AuthContext";
import {useDb} from "../../firebase/context/DbContext";
import {collections} from "../../common/constants/collections";
import {loadDbSheetsNames, updateSheetsIncludingDb, updateSheetsLocally} from "./dashboardFunctions";
import {Sheets} from "./Sheets";
import {ISheet} from "../../common/types/sheetTypes";
import {useAppSelector} from "../../store";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.DASHBOARD>

export default function Dashboard({navigation}: Props) {
    const [sheets, setSheets] = useState<Array<ISheet>>([]);

    const {signOut} = useAuth();
    const {db} = useDb();
    const user = useAppSelector(state => state.user);

    // we try to fetch sheet names from local storage to make the first load faster
    useEffect(() => {
        async function fetchStoreSheets() {
            return await loadData(asyncStorageKeys.SHEETS, true);
        }

        fetchStoreSheets()
            .then(res => res && setSheets(res))
            .catch(e => {
                console.info("Unable to fetch local sheets: ");
                console.error(e);
            });
    }, []);

    // we also try to fetch data from the db and replace local data if successful
    useEffect(() => {
        // we can only call the store if we already have the user object ready
        if (user.uid) {
            loadDbSheetsNames(db, user.uid)
                .then(sheets => {
                    updateSheetsLocally(sheets, setSheets)
                })
                .catch(e => {
                    console.info("Unable to fetch local sheet names: ");
                    console.error(e);
                });
        }
    }, [user]);

    function removeSheet(i: number) {
        console.log("Removing sheet with i: " + i);
        if (window.confirm("Do you really want to get rid of this sheet? It shall be taken, but not returned...")) {
            const tSheetNames = [...sheets];
            tSheetNames.splice(i, 1);
            if (sheets[i].id && user.uid) {
                sheets[i].id && updateSheetsIncludingDb(tSheetNames, sheets[i].id!, setSheets, db, user.uid);
            } else {
                console.error("Cannot remove sheet: sheet id or uid not provided:");
                console.info(sheets[i]);
                console.info(user)
            }
        }
    }

    async function logOut() {
        await removeItem(asyncStorageKeys.USER_LOGGED_IN);
        signOut().then(() => {
            console.log("User logged out.");
            navigation.navigate(NavigationLocations.LOGIN);
        })
    }

    function createNewSheet() {
        if (user.uid) {
            const sheetName = "New sheet";
            console.log("Creating a new sheet");
            const timesStamp = Date.now();
            db.collection(collections.USERS).doc(user.uid).collection(collections.SHEETS).add({
                sheetName: sheetName,
                timeStamp: timesStamp,
                fieldsArray: [],
            })
                .then(() => {
                    console.log("New sheet added for user " + user.uid + " with name " + sheetName);
                    loadDbSheetsNames(db, user.uid!)
                        .then(sheetNames => {
                            updateSheetsLocally(sheetNames, setSheets)
                        })
                        .catch(e => {
                            console.info("Unable to fetch local sheet names: ");
                            console.error(e);
                        });
                })
                .catch((e) => {
                    console.warn("Received error while trying to add a new sheet for user" + user.uid + " with name " + sheetName);
                    console.error(e);
                });
        } else {
            console.error("Cannot create new sheet, uid not provided: " + user.uid);
        }
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
            <Sheets sheets={sheets} removeSheet={removeSheet} navigation={navigation}/>
            <Button title="New sheet" onPress={() => createNewSheet()}/>
            <Button title="Logout" onPress={() => logOut()}/>
        </BasicView>
    );
}

