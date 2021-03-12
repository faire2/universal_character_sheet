import React, {useState} from "react";
import {Alert, Button} from "react-native";
import {NavigationLocations} from "../common/constants/locations";
import {logNavigationError} from "../common/functions/commonFunctions";
import {saveData} from "../common/functions/asyncStorage";
import {BasicInput, BasicLink, BasicView, Preloader} from "../common/styling/commonStyles";
import {useAuth} from "../firebase/context/AuthContext";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {NavigationProps} from "../common/types/generalTypes";
import firebase from "firebase";

export default function Login(props: NavigationProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(""); //todo display error message
    const { signIn } = useAuth();


    function logUserIn() {
        if (email === "" || password === "") {
            Alert.alert("Enter all details to log in!")
        } else {
            setIsLoading(true);
            signIn(email, password)
                .then((res: firebase.auth.UserCredential) => {
                    console.log("User logged in");
                    console.log(res);
                    setIsLoading(false);
                    saveData(asyncStorageKeys.USER_LOGGED_IN, true)
                        .catch(e => {
                            console.error("Unable to save logged in status: ");
                            console.error(e);
                        });
                    setEmail("");
                    setPassword("");
                    props.navigation.navigate(NavigationLocations.DASHBOARD)
                        .catch((e: Error) => logNavigationError(e));
                })
                .catch((e: Error) => setErrorMessage(e.message));
        }
    }

    return (
        <BasicView>
            { isLoading && <Preloader /> }
            <BasicInput placeholder="email" value={email} onChangeText={(val) => setEmail(val)}/>
            <BasicInput placeholder="password" value={password} onChangeText={(val) => setPassword(val)} maxLength={15} secureTextEntry={true}/>
            <Button title="Login" onPress={() => logUserIn()} />
            <BasicLink onPress={() => props.navigation.navigate(NavigationLocations.SIGNUP)}>
                New user? Sign in here...
            </BasicLink>
        </BasicView>
    );
}