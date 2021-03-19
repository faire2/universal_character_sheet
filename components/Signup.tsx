import React, {useEffect, useState} from "react";
import {NavigationLocations} from "../common/constants/locations";
import {loadData, saveData} from "../common/functions/asyncStorage";
import {firebaseApp} from "../firebase/config";
import {BasicInput, BasicLink, BasicView, Preloader} from "../common/styling/commonStyles";
import {Alert, Button, ScrollView} from "react-native";
import {getErrorMessage} from "../common/constants/firebaseErrors";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {useDb} from "../firebase/context/DbContext";
import {collections} from "../common/constants/collections";
import {IFirebaseError, NavigationProps} from "../common/types/generalTypes";

export default function Signup(props: NavigationProps) {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {db} = useDb();

    // if user is logged in, reroute him to dashboard
    useEffect(() => {
        loadData(asyncStorageKeys.USER_LOGGED_IN, true)
            .then(isUserLoggedIn => {
                    if (isUserLoggedIn) {
                        props.navigation.navigate(NavigationLocations.DASHBOARD);
                    } else {
                        console.log("No user is signed in.");
                    }
                }
            )
            .catch(e => {
                console.error("Unable check locally if user is logged in.");
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
                                    console.error("Unable to save user data:");
                                    console.error(e);
                                }
                            );
                        // create new user in top collection
                        const uid = res.user.uid;
                        debugger;
                        db.collection(collections.USERS).doc(uid).set({
                            email: res.user.email,
                            displayName: displayName,
                            uid: uid,
                        }).then(() =>  console.log("Created new user document with id: " + uid))
                            .catch(e => {
                                    console.warn("Unable to create a document for new user. Error:");
                                    console.error(e);
                                }
                            );
                        // reroute to dashboard
                        props.navigation.navigate(NavigationLocations.DASHBOARD);
                    } else {
                        console.info(res);
                        throw new Error("Could not retrieve user object.");
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
                <BasicLink onPress={() => props.navigation.navigate(NavigationLocations.LOGIN)}>
                    Already registered? Click here to log in...
                </BasicLink>
            </ScrollView>
        </BasicView>
    )
};