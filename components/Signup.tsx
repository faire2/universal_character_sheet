import React, {useEffect, useState} from "react";
import {loadData, saveData} from "../common/functions/asyncStorage";
import {firebaseApp} from "../firebase/config";
import {BasicInput, BasicLink, BasicView, Preloader} from "../common/styling/commonStyles";
import {Alert, Button, ScrollView} from "react-native";
import {getErrorMessage} from "../common/constants/firebaseErrors";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {useDb} from "../firebase/context/DbContext";
import {collections} from "../common/constants/collections";
import {IFirebaseError} from "../common/types/generalTypes";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {NavigationLocations, RootStackParamList} from "../common/navigation/NavigationStack";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.SIGNUP>

export default function Signup({navigation}: Props) {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {db} = useDb();

    // if userData is logged in, reroute him to dashboard
    useEffect(() => {
        loadData(asyncStorageKeys.USER_LOGGED_IN, true)
            .then(isUserLoggedIn => {
                    if (isUserLoggedIn) {
                        navigation.navigate(NavigationLocations.DASHBOARD);
                    } else {
                        console.log("No userData is signed in.");
                    }
                }
            )
            .catch(e => {
                console.error("Unable check locally if userData is logged in.");
                console.error(e);
            });
    }, []);

    function resetState() {
        setEmail("");
        setPassword("");
        setIsLoading(false);
    }

    function registerUser() {
        if (email === "" || password === "") {
            Alert.alert(
                "Hi buddy!",
                "If you want to get in, I will need both valid email and reasonable password. No sorry, natural 20 charisma" +
                " check does not change that.",
                [{
                    text: "ok",
                    style: "cancel"
                }],
                {cancelable: true});
        } else {
            setIsLoading(true);
            firebaseApp
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    if (res && res.user) {
                        // set display name for new account
                        res.user.updateProfile({displayName: displayName})
                            .then(() => console.log("Displayname updated: " + displayName))
                            .catch(e => console.error(e));
                        console.info("User registered succesfully: " + email);
                        resetState();
                        // save data for next start of the app
                        saveData(asyncStorageKeys.USER_LOGGED_IN, true)
                            .catch(e => {
                                    console.error("Unable to save userData data:");
                                    console.error(e);
                                }
                            );
                        // create new userData in top collection
                        const uid = res.user.uid;
                        db.collection(collections.USERS).doc(uid).set({
                            email: res.user.email,
                            displayName: displayName,
                            uid: uid,
                        }).then(() => console.log("Created new userData document with id: " + uid))
                            .catch(e => {
                                    console.warn("Unable to create a document for new userData. Error:");
                                    console.error(e);
                                }
                            );
                        // reroute to dashboard
                        navigation.navigate(NavigationLocations.DASHBOARD);
                    } else {
                        console.info(res);
                        throw new Error("Could not retrieve userData object.");
                    }

                })
                .catch((e: IFirebaseError) => {
                    let errorMesage: string = getErrorMessage(e);
                    console.info(errorMesage);
                    Alert.alert(getErrorMessage(e));
                })
        }
    }

    return (
        <BasicView>
            {isLoading && <Preloader/>}
            <ScrollView>
                <BasicInput placeholder="email" value={email} onChangeText={(val) => setEmail(val)}/>
                <BasicInput placeholder="password" value={password} onChangeText={(val) => setPassword(val)}
                            maxLength={15} secureTextEntry={true}/>
                <BasicInput placeholder="name" value={displayName} onChangeText={(val) => setDisplayName(val)}/>
                <Button title="Signup" onPress={() => registerUser()}/>
                <BasicLink onPress={() => navigation.navigate(NavigationLocations.LOGIN)}>
                    Already registered? Click here to log in...
                </BasicLink>
            </ScrollView>
        </BasicView>
    )
};