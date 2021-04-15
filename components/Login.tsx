import React, {useState} from "react";
import {Alert, Button} from "react-native";
import {saveData} from "../common/functions/asyncStorage";
import {BasicInput, BasicLink, BasicView, Preloader} from "../common/styling/commonStyles";
import {useAuth} from "../firebase/context/AuthContext";
import {asyncStorageKeys} from "../common/constants/asyncStorageKeys";
import {IFirebaseError} from "../common/types/generalTypes";
import firebase from "firebase";
import {getErrorMessage} from "../common/constants/firebaseErrors";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {NavigationLocations, RootStackParamList} from "../common/navigation/NavigationStack";

export default function Login({navigation}: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {signIn} = useAuth();


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
                    navigation.navigate(NavigationLocations.DASHBOARD);
                })
                .catch((e: IFirebaseError) => {
                        let errorMesage: string = getErrorMessage(e);
                        console.info(errorMesage);
                        Alert.alert(getErrorMessage(e));
                    }
                );
        }
    }

    return (
        <BasicView>
            {isLoading ? <Preloader/> : null}
            <BasicInput placeholder="email" value={email} onChangeText={(val) => setEmail(val)}/>
            <BasicInput placeholder="password" value={password} onChangeText={(val) => setPassword(val)} maxLength={15}
                        secureTextEntry={true}/>
            <Button title="Login" onPress={() => logUserIn()}/>
            <BasicLink onPress={() => navigation.navigate(NavigationLocations.SIGNUP)}>
                New user? Sign in here...
            </BasicLink>
        </BasicView>
    );
}

type Props = StackScreenProps<RootStackParamList, NavigationLocations.LOGIN>
