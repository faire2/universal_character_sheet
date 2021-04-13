import React, {useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {Button} from "react-native";

import {removeItem} from "../../common/functions/asyncStorage";
import {BasicView} from "../../common/styling/commonStyles";
import {asyncStorageKeys} from "../../common/constants/asyncStorageKeys";
import {useAuth} from "../../firebase/context/AuthContext";
import {Sheets} from "./Sheets";
import {ISheet} from "../sheet/sheetTypes";
import {useAppSelector} from "../../store";
import {fetchSheetsFromDb, fetchSheetsLocally, removeSheet, selectAllSheets} from "../../store/sheetsSlice";
import {useDispatch} from "react-redux";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/NavigationStack";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.DASHBOARD>

export default function Dashboard({navigation}: Props) {
    const {signOut} = useAuth();

    const dispatch = useDispatch();
    const user = useAppSelector(state => state.user.userData);
    const sheets: ISheet[] = useAppSelector(selectAllSheets);

    // we try to fetch sheet names from local storage to make the first load faster
    useEffect(() => {
        dispatch(fetchSheetsLocally());
    }, []);

    // we also try to fetch data from the db and replace local data if successful
    // we can only call the store if we already have the userData object ready
    useEffect(() => {
        if (user.uid) {
            dispatch(fetchSheetsFromDb(null));
        }
    }, [user]);

    function handleSheetRemoval(i: number) {
        const sheetId = sheets[i].id;
        console.log("Removing sheet with id: " + sheetId);
        if (sheetId) {
            dispatch((removeSheet({sheetId: sheetId})));
        } else {
            console.error("Unable to remove sheet")
        }
    }

    async function logOut() {
        await removeItem(asyncStorageKeys.USER_LOGGED_IN);
        signOut().then(() => {
            console.log("User logged out.");
            navigation.navigate(NavigationLocations.LOGIN);
        })
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
                {text: "Sure!", onPress: () => handleRemoveSheet(i)}
            ],
            {cancelable: false}
        );
    }*/

    return (
        <BasicView>
            <Sheets sheets={sheets} removeSheet={handleSheetRemoval} navigation={navigation} />
            <Button title="New sheet" onPress={() => navigation.navigate(NavigationLocations.TEMPLATES)} />
            <Button title="Logout" onPress={() => logOut()} />
            <Button title="Fetch Sheets" onPress={() => dispatch(fetchSheetsFromDb(null))} />
        </BasicView>
    );
}

