import React, {useState} from "react";
import {Alert} from "react-native-web";
import {NavigationLocations} from "../common/constants/locations";
import {logNavigationError} from "../common/functions/commonFunctions";
import {BasicInput, BasicLink, BasicView, Preloader} from "../styling/commonStyles";
import {Button} from "react-native";
import {useAuth} from "../common/context/AuthContext";
import {saveData} from "../common/functions/asyncStorageFunctions";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null); //todo display error message
    const { signIn } = useAuth();


    function logUserIn() {
        if (email === "" || password === "") {
            Alert.alert("Enter all details to log in!")
        } else {
            setIsLoading(true);
            signIn(email, password)
                .then(res => {
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
                        .catch(e => logNavigationError(e));
                })
                .catch(e => setErrorMessage(e));
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